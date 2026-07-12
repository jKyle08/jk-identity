import { IsEmail, IsString, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../../constants';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  password!: string;
}
