import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  login: string;

  @IsString()
  password: string;

  @IsString()
  name: string;
}
