import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({ message: 'email cannot be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  @IsStrongPassword()
  password: string;
}
