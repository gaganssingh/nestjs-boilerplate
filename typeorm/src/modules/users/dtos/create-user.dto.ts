import { OmitType } from '@nestjs/mapped-types';
import { SignupUserDto } from 'src/modules/auth/dtos/signup-user.dto';

export class CreateUserDto extends OmitType(SignupUserDto, [
  'confirmPassword',
]) {}
