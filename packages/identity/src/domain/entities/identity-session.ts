export interface IdentitySessionProps {
  id: string;
  identityId: string;
  refreshTokenId: string;
  refreshTokenHash?: string | null;
  deviceName?: string | null;
  browser?: string | null;
  operatingSystem?: string | null;
  ipAddress?: string | null;
  country?: string | null;
  userAgent?: string | null;
  expiresAt: Date;
  lastActivityAt: Date;
  revokedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class IdentitySession {
  private constructor(private readonly props: IdentitySessionProps) {}

  static create(
    props: Omit<IdentitySessionProps, 'createdAt' | 'updatedAt' | 'lastActivityAt'> & {
      lastActivityAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): IdentitySession {
    const now = new Date();
    return new IdentitySession({
      ...props,
      lastActivityAt: props.lastActivityAt ?? now,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  static reconstitute(props: IdentitySessionProps): IdentitySession {
    return new IdentitySession(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get refreshTokenId(): string {
    return this.props.refreshTokenId;
  }

  get refreshTokenHash(): string | null | undefined {
    return this.props.refreshTokenHash;
  }

  get deviceName(): string | null | undefined {
    return this.props.deviceName;
  }

  /** @deprecated Use deviceName instead. */
  get device(): string | null | undefined {
    return this.props.deviceName;
  }

  get browser(): string | null | undefined {
    return this.props.browser;
  }

  get operatingSystem(): string | null | undefined {
    return this.props.operatingSystem;
  }

  get ipAddress(): string | null | undefined {
    return this.props.ipAddress;
  }

  get country(): string | null | undefined {
    return this.props.country;
  }

  get userAgent(): string | null | undefined {
    return this.props.userAgent;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get lastActivityAt(): Date {
    return this.props.lastActivityAt;
  }

  get revokedAt(): Date | null | undefined {
    return this.props.revokedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isActive(): boolean {
    return !this.props.revokedAt && this.props.expiresAt > new Date();
  }

  isRevoked(): boolean {
    return !!this.props.revokedAt;
  }

  isExpired(): boolean {
    return this.props.expiresAt <= new Date();
  }

  toProps(): IdentitySessionProps {
    return { ...this.props };
  }

  revoke(): IdentitySession {
    return IdentitySession.reconstitute({
      ...this.props,
      revokedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  touch(): IdentitySession {
    return IdentitySession.reconstitute({
      ...this.props,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
