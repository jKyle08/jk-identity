import { IdentitySession } from '../entities/identity-session';
import { RefreshToken } from '../entities/refresh-token';
import { VerificationToken } from '../entities/verification-token';
import { PasswordResetToken } from '../entities/password-reset-token';

export interface SessionMetadata {
  deviceName?: string;
  /** @deprecated Use deviceName instead. */
  device?: string;
  browser?: string;
  operatingSystem?: string;
  ipAddress?: string;
  country?: string;
  userAgent?: string;
}

export interface CreateSessionInput {
  identityId: string;
  refreshTokenHash: string;
  refreshTokenExpiresAt: Date;
  sessionExpiresAt: Date;
  metadata?: SessionMetadata;
}

export interface CreateSessionResult {
  session: IdentitySession;
  refreshToken: RefreshToken;
}

export interface SessionRepository {
  createSession(input: CreateSessionInput): Promise<CreateSessionResult>;
  findSessionById(sessionId: string): Promise<IdentitySession | null>;
  findSessionsByIdentityId(identityId: string): Promise<IdentitySession[]>;
  findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null>;
  refreshSession(
    sessionId: string,
    oldRefreshTokenId: string,
    newRefreshTokenHash: string,
    newRefreshTokenExpiresAt: Date,
  ): Promise<CreateSessionResult>;
  revokeSession(sessionId: string): Promise<void>;
  revokeAllSessions(identityId: string): Promise<void>;
  createVerificationToken(
    identityId: string,
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<VerificationToken>;
  findVerificationTokenByHash(tokenHash: string): Promise<VerificationToken | null>;
  markVerificationTokenUsed(tokenId: string): Promise<void>;
  createPasswordResetToken(
    identityId: string,
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken>;
  findPasswordResetTokenByHash(tokenHash: string): Promise<PasswordResetToken | null>;
  markPasswordResetTokenUsed(tokenId: string): Promise<void>;
}

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');
