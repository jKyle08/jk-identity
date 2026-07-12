export interface RefreshTokenProps {
  id: string;
  identityId: string;
  sessionId: string;
  tokenHash: string;
  expiresAt: Date;
  rotatedFromId?: string | null;
  revokedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RefreshToken {
  private constructor(private readonly props: RefreshTokenProps) {}

  static create(
    props: Omit<RefreshTokenProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): RefreshToken {
    const now = new Date();
    return new RefreshToken({
      ...props,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  static reconstitute(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get sessionId(): string {
    return this.props.sessionId;
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get rotatedFromId(): string | null | undefined {
    return this.props.rotatedFromId;
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

  toProps(): RefreshTokenProps {
    return { ...this.props };
  }

  revoke(): RefreshToken {
    return RefreshToken.reconstitute({
      ...this.props,
      revokedAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
