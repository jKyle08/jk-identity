import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Email verification token from the verification email' })
  @IsString()
  token!: string;
}

export class ResendVerificationDto {
  @ApiProperty({ description: 'Identity ID returned from registration' })
  @IsString()
  identityId!: string;
}
