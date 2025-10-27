import { IsEmail, IsEmpty, IsStrongPassword } from "class-validator";

export class UserSignupDto {
  @IsEmpty()
  name: string;

  @IsEmpty()
  @IsEmail()
  email: string;

  @IsEmpty()
  @IsStrongPassword()
  password: string;

  
  
}
