import { IsString, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../../constants';

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  newPassword!: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword!: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  newPassword!: string;
}
