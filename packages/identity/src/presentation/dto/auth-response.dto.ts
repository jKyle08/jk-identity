import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthTokensResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  accessTokenExpiresAt!: Date;

  @ApiProperty()
  refreshTokenExpiresAt!: Date;
}

export class IdentityResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiPropertyOptional()
  middleName?: string | null;

  @ApiProperty()
  lastName!: string;

  @ApiPropertyOptional()
  suffix?: string | null;

  @ApiPropertyOptional()
  displayName?: string | null;

  @ApiProperty()
  primaryEmail!: string;

  @ApiProperty()
  emailVerified!: boolean;

  @ApiProperty()
  accountStatus!: string;
}

export class AuthResponseDto {
  @ApiProperty({ type: IdentityResponseDto })
  identity!: IdentityResponseDto;

  @ApiProperty({ type: AuthTokensResponseDto })
  tokens!: AuthTokensResponseDto;
}
