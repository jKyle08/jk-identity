import { randomUUID } from 'crypto';
import {
  CreateSessionInput,
  CreateSessionResult,
  IdentitySession,
  PasswordResetToken,
  RefreshToken,
  SessionRepository,
  VerificationToken,
} from '@jk/identity';
import { MemoryVerificationRepository } from './memory-verification.repository';

/**
 * In-memory implementation of {@link SessionRepository}.
 * Composes {@link MemoryVerificationRepository} for token storage.
 */
export class MemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, IdentitySession>();
  private readonly refreshTokens = new Map<string, RefreshToken>();
  private readonly refreshTokenByHash = new Map<string, string>();
  private readonly sessionsByIdentity = new Map<string, Set<string>>();

  constructor(
    private readonly verification: MemoryVerificationRepository = new MemoryVerificationRepository(),
  ) {}

  get verificationRepository(): MemoryVerificationRepository {
    return this.verification;
  }

  async createSession(input: CreateSessionInput): Promise<CreateSessionResult> {
    const sessionId = randomUUID();
    const refreshTokenId = randomUUID();
    const now = new Date();

    const refreshToken = RefreshToken.create({
      id: refreshTokenId,
      identityId: input.identityId,
      sessionId,
      tokenHash: input.refreshTokenHash,
      expiresAt: input.refreshTokenExpiresAt,
    });

    const session = IdentitySession.create({
      id: sessionId,
      identityId: input.identityId,
      refreshTokenId,
      refreshTokenHash: input.refreshTokenHash,
      deviceName: input.metadata?.deviceName ?? input.metadata?.device,
      browser: input.metadata?.browser,
      operatingSystem: input.metadata?.operatingSystem,
      ipAddress: input.metadata?.ipAddress,
      country: input.metadata?.country,
      userAgent: input.metadata?.userAgent,
      expiresAt: input.sessionExpiresAt,
    });

    this.sessions.set(sessionId, session);
    this.refreshTokens.set(refreshTokenId, refreshToken);
    this.refreshTokenByHash.set(input.refreshTokenHash, refreshTokenId);

    const identitySessions = this.sessionsByIdentity.get(input.identityId) ?? new Set();
    identitySessions.add(sessionId);
    this.sessionsByIdentity.set(input.identityId, identitySessions);

    return { session, refreshToken };
  }

  async findSessionById(sessionId: string): Promise<IdentitySession | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  async findSessionsByIdentityId(identityId: string): Promise<IdentitySession[]> {
    const sessionIds = this.sessionsByIdentity.get(identityId);
    if (!sessionIds) {
      return [];
    }
    return [...sessionIds]
      .map((id) => this.sessions.get(id))
      .filter((s): s is IdentitySession => !!s);
  }

  async findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
    const id = this.refreshTokenByHash.get(tokenHash);
    return id ? (this.refreshTokens.get(id) ?? null) : null;
  }

  async refreshSession(
    sessionId: string,
    oldRefreshTokenId: string,
    newRefreshTokenHash: string,
    newRefreshTokenExpiresAt: Date,
  ): Promise<CreateSessionResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    const oldToken = this.refreshTokens.get(oldRefreshTokenId);
    if (oldToken) {
      const revoked = oldToken.revoke();
      this.refreshTokens.set(oldRefreshTokenId, revoked);
      this.refreshTokenByHash.delete(oldToken.tokenHash);
    }

    const newRefreshTokenId = randomUUID();
    const newRefreshToken = RefreshToken.create({
      id: newRefreshTokenId,
      identityId: session.identityId,
      sessionId,
      tokenHash: newRefreshTokenHash,
      expiresAt: newRefreshTokenExpiresAt,
      rotatedFromId: oldRefreshTokenId,
    });

    const updatedSession = IdentitySession.reconstitute({
      ...session.toProps(),
      refreshTokenId: newRefreshTokenId,
      refreshTokenHash: newRefreshTokenHash,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    });

    this.sessions.set(sessionId, updatedSession);
    this.refreshTokens.set(newRefreshTokenId, newRefreshToken);
    this.refreshTokenByHash.set(newRefreshTokenHash, newRefreshTokenId);

    return { session: updatedSession, refreshToken: newRefreshToken };
  }

  async revokeSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    const revokedSession = session.revoke();
    this.sessions.set(sessionId, revokedSession);

    const refreshToken = this.refreshTokens.get(session.refreshTokenId);
    if (refreshToken) {
      const revokedToken = refreshToken.revoke();
      this.refreshTokens.set(session.refreshTokenId, revokedToken);
      this.refreshTokenByHash.delete(refreshToken.tokenHash);
    }
  }

  async revokeAllSessions(identityId: string): Promise<void> {
    const sessionIds = this.sessionsByIdentity.get(identityId);
    if (!sessionIds) {
      return;
    }

    for (const sessionId of sessionIds) {
      await this.revokeSession(sessionId);
    }
  }

  async createVerificationToken(
    identityId: string,
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<VerificationToken> {
    return this.verification.createVerificationToken(identityId, email, tokenHash, expiresAt);
  }

  async findVerificationTokenByHash(tokenHash: string): Promise<VerificationToken | null> {
    return this.verification.findVerificationTokenByHash(tokenHash);
  }

  async markVerificationTokenUsed(tokenId: string): Promise<void> {
    this.verification.markVerificationTokenUsed(tokenId);
  }

  async createPasswordResetToken(
    identityId: string,
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken> {
    return this.verification.createPasswordResetToken(identityId, email, tokenHash, expiresAt);
  }

  async findPasswordResetTokenByHash(tokenHash: string): Promise<PasswordResetToken | null> {
    return this.verification.findPasswordResetTokenByHash(tokenHash);
  }

  async markPasswordResetTokenUsed(tokenId: string): Promise<void> {
    this.verification.markPasswordResetTokenUsed(tokenId);
  }

  clear(): void {
    this.sessions.clear();
    this.refreshTokens.clear();
    this.refreshTokenByHash.clear();
    this.sessionsByIdentity.clear();
    this.verification.clear();
  }
}
