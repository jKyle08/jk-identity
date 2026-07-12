export class AuthTokensResponseDto {
  accessToken!: string;
  refreshToken!: string;
  accessTokenExpiresAt!: Date;
  refreshTokenExpiresAt!: Date;
}

export class IdentityResponseDto {
  id!: string;
  firstName!: string;
  middleName?: string | null;
  lastName!: string;
  suffix?: string | null;
  displayName?: string | null;
  primaryEmail!: string;
  emailVerified!: boolean;
  accountStatus!: string;
}

export class AuthResponseDto {
  identity!: IdentityResponseDto;
  tokens!: AuthTokensResponseDto;
}
