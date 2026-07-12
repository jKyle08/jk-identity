import { Identity } from '../../domain/entities/identity';
import { IdentityResponseDto, AuthResponseDto } from '../dto/auth-response.dto';

export function toIdentityResponse(identity: Identity): IdentityResponseDto {
  return {
    id: identity.id,
    firstName: identity.firstName,
    middleName: identity.middleName,
    lastName: identity.lastName,
    suffix: identity.suffix,
    displayName: identity.displayName,
    primaryEmail: identity.primaryEmail,
    emailVerified: identity.emailVerified,
    accountStatus: identity.accountStatus,
  };
}

export function toAuthResponse(
  identity: Identity,
  tokens: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: Date;
    refreshTokenExpiresAt: Date;
  },
): AuthResponseDto {
  return {
    identity: toIdentityResponse(identity),
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessTokenExpiresAt: tokens.accessTokenExpiresAt,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    },
  };
}
