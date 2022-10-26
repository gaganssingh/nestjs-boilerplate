import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { User } from '../entities';
import { DeleteUser } from '../interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  public async findAll(): Promise<User[]> {
    return this.usersRepo.find();
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepo.create(createUserDto);
    return await this.usersRepo.save(user);
  }

  public async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Using usersRepo.update() with not trigger the Entity hooks to run
    // ❌ return this.usersRepo.update(id, updateUserDto)

    // ✅ so using .save() instead
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(
        `Could not find user with id "${id}"; update failed`,
      );
    }

    Object.assign(user, { ...updateUserDto });
    return await this.usersRepo.save(user);
  }

  public async delete(id: string): Promise<void> {
    // Using usersRepo.delete() with not trigger the User entity hooks to run
    // ❌ return this.usersRepo.delete(id)

    // ✅ so using .remove() instead
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(
        `Could not find user with id "${id}"; deletion failed`,
      );
    }

    const deletedUser = await this.usersRepo.remove(user);
    if (!deletedUser) {
      throw new InternalServerErrorException(
        `Something went wrong with the server; please try again later`,
      );
    }
  }
}
