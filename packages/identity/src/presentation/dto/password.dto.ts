import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { MIN_PASSWORD_LENGTH } from '../../constants';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token from the reset email' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NewSecureP@ss2', minLength: MIN_PASSWORD_LENGTH })
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  newPassword!: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'SecureP@ss1' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'NewSecureP@ss2', minLength: MIN_PASSWORD_LENGTH })
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  newPassword!: string;
}
