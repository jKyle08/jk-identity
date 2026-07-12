import { randomUUID } from 'crypto';
import {
  PasswordResetToken,
  VerificationToken,
} from '@jk/identity';

/**
 * In-memory store for email verification and password reset tokens.
 * Reference implementation — composed by MemorySessionRepository.
 */
export class MemoryVerificationRepository {
  private readonly verificationTokens = new Map<string, VerificationToken>();
  private readonly verificationByHash = new Map<string, string>();
  private readonly passwordResetTokens = new Map<string, PasswordResetToken>();
  private readonly passwordResetByHash = new Map<string, string>();

  createVerificationToken(
    identityId: string,
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ): VerificationToken {
    const id = randomUUID();
    const token = VerificationToken.create({
      id,
      identityId,
      email,
      tokenHash,
      expiresAt,
    });

    this.verificationTokens.set(id, token);
    this.verificationByHash.set(tokenHash, id);
    return token;
  }

  findVerificationTokenByHash(tokenHash: string): VerificationToken | null {
    const id = this.verificationByHash.get(tokenHash);
    return id ? (this.verificationTokens.get(id) ?? null) : null;
  }

  markVerificationTokenUsed(tokenId: string): void {
    const token = this.verificationTokens.get(tokenId);
    if (!token) {
      return;
    }
    const used = token.markUsed();
    this.verificationTokens.set(tokenId, used);
  }

  createPasswordResetToken(
    identityId: string,
    email: string,
    tokenHash: string,
    expiresAt: Date,
  ): PasswordResetToken {
    const id = randomUUID();
    const token = PasswordResetToken.create({
      id,
      identityId,
      email,
      tokenHash,
      expiresAt,
    });

    this.passwordResetTokens.set(id, token);
    this.passwordResetByHash.set(tokenHash, id);
    return token;
  }

  findPasswordResetTokenByHash(tokenHash: string): PasswordResetToken | null {
    const id = this.passwordResetByHash.get(tokenHash);
    return id ? (this.passwordResetTokens.get(id) ?? null) : null;
  }

  markPasswordResetTokenUsed(tokenId: string): void {
    const token = this.passwordResetTokens.get(tokenId);
    if (!token) {
      return;
    }
    const used = token.markUsed();
    this.passwordResetTokens.set(tokenId, used);
  }

  clear(): void {
    this.verificationTokens.clear();
    this.verificationByHash.clear();
    this.passwordResetTokens.clear();
    this.passwordResetByHash.clear();
  }
}
