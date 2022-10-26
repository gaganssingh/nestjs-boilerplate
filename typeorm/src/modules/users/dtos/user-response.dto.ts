
import { Exclude } from 'class-transformer';
import { User } from '../entities';

export class UserResponseDto extends User {
  @Exclude()
  password: string;
}
