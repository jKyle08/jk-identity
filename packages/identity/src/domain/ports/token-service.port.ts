export interface TokenPayload {
  sub: string;
  sessionId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

export interface TokenServicePort {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  generateRefreshToken(): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  hashToken(token: string): Promise<string>;
  verifyTokenHash(token: string, hash: string): Promise<boolean>;
}

export const TOKEN_SERVICE = Symbol('TOKEN_SERVICE');
