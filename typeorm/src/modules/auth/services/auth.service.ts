import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { User } from 'src/modules/users/entities';
import { UsersService } from 'src/modules/users/services';
import { promisify } from 'util';
import { LoginUserDto, SignupUserDto } from '../dtos';
import { LoginResponse } from '../interfaces';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  private async _hashPassword(plainPwd: string) {
    // Hash user's password
    const salt = randomBytes(12).toString('hex');
    const hash = (await scrypt(plainPwd, salt, 32)) as Buffer;
    return `${salt}.${hash.toString('hex')}`;
  }

  private async _doPasswordsMatch(
    plainPwd: string,
    storedPwd: string,
  ): Promise<boolean> {
    // // Split the stored hashed and salted password by the combining character "."
    const [salt, stroredHash] = storedPwd.split('.');

    // // Hash the plain text password
    const hashedSigninPassword = (await scrypt(plainPwd, salt, 32)) as Buffer;

    // If passwords match, return true
    // otherwise return false
    return stroredHash === hashedSigninPassword.toString('hex');
  }

  async signup(signupUserDto: SignupUserDto): Promise<User> {
    const { email, password, confirmPassword } = signupUserDto;

    // Confirm if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException(
        `Passwords don't match; aborting user signup`,
      );
    }

    // Confirm if email already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        `Email "${email}" already in use; please login instead`,
      );
    }

    // Hash user's password
    const hashedAndSaltedPassword = await this._hashPassword(password);

    try {
      const userToSignup = {
        ...signupUserDto,
        password: hashedAndSaltedPassword,
      };
      delete userToSignup.confirmPassword;

      // Create the new user in the db
      return await this.usersService.create(userToSignup);
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException(
        'Something went wrong with the server, please try again later',
      );
    }
  }

  async getAuthenticatedUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Find the existing user in the db
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // // if user doesn't exist, throw error
      throw new NotFoundException(
        `Invalid credentials provided; please try again`,
      );
    }

    // Confirm if password is correct
    const doPasswordsMatch = await this._doPasswordsMatch(
      password,
      user.password,
    );
    if (!doPasswordsMatch) {
      throw new UnauthorizedException(
        `Invalid credentials provided; please try again`,
      );
    }

    // If password is valid
    return user;
  }

  // 🐻‍❄️ JWT transporting directly in the response
  async getJwtToken(user: User) {
    const payload = {
      ...user,
    };

    // Delete the user's password from the User object,
    // so that it's not included inside the jwt
    delete payload.password;

    return this.jwtService.sign(payload, {
      algorithm: 'HS512',
    });
  }

  async login(user: User): Promise<LoginResponse> {
    return {
      email: user.email,
      accessToken: await this.getJwtToken(user),
    };
  }
}
