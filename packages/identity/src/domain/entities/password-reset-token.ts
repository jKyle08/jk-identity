export interface PasswordResetTokenProps {
  id: string;
  identityId: string;
  tokenHash: string;
  email: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}

export class PasswordResetToken {
  private constructor(private readonly props: PasswordResetTokenProps) {}

  static create(
    props: Omit<PasswordResetTokenProps, 'createdAt'> & { createdAt?: Date },
  ): PasswordResetToken {
    return new PasswordResetToken({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  static reconstitute(props: PasswordResetTokenProps): PasswordResetToken {
    return new PasswordResetToken(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get tokenHash(): string {
    return this.props.tokenHash;
  }

  get email(): string {
    return this.props.email;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get usedAt(): Date | null | undefined {
    return this.props.usedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  isValid(): boolean {
    return !this.props.usedAt && this.props.expiresAt > new Date();
  }

  toProps(): PasswordResetTokenProps {
    return { ...this.props };
  }

  markUsed(): PasswordResetToken {
    return PasswordResetToken.reconstitute({
      ...this.props,
      usedAt: new Date(),
    });
  }
}
