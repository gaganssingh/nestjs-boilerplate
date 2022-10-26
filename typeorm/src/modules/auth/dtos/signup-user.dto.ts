import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @MinLength(8)
  @MaxLength(35)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,}).*$/, {
    message:
      'Password must include at-least 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
