import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class UserSignupDto {
  @IsNotEmpty({ message: 'name cannot be empty' })
  name: string;

  @IsNotEmpty({ message: 'email cannot be empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'password cannot be empty' })
  @IsStrongPassword()
  password: string;
}
