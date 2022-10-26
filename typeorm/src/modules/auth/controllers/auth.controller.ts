import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Serialize } from 'src/common/interceptors';
import { UserResponseDto } from 'src/modules/users/dtos';
import { User } from 'src/modules/users/entities';
import { SignupUserDto } from '../dtos';
import { JwtAuthGuard, LocalAuthGuard } from '../guards';
import { LoginResponse, RequestWithUser } from '../interfaces';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Serialize(UserResponseDto)
  async signup(@Body() signupUserDto: SignupUserDto) {
    return await this.authService.signup(signupUserDto);
  }

  // 🐻‍❄️ JWT transporting directly in the response
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Req() request: RequestWithUser): Promise<LoginResponse> {
    const { user } = request;

    // Returning the jwt inside the response
    return await this.authService.login(user);
  }

  @Get('current-user')
  @UseGuards(JwtAuthGuard)
  async authenticateCurrentUser(
    @Req() request: RequestWithUser,
  ): Promise<User> {
    const { user } = request;
    return user;
  }
}
