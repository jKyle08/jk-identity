export interface VerificationTokenProps {
  id: string;
  identityId: string;
  tokenHash: string;
  email: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
}

export class VerificationToken {
  private constructor(private readonly props: VerificationTokenProps) {}

  static create(
    props: Omit<VerificationTokenProps, 'createdAt'> & { createdAt?: Date },
  ): VerificationToken {
    return new VerificationToken({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  static reconstitute(props: VerificationTokenProps): VerificationToken {
    return new VerificationToken(props);
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

  toProps(): VerificationTokenProps {
    return { ...this.props };
  }

  markUsed(): VerificationToken {
    return VerificationToken.reconstitute({
      ...this.props,
      usedAt: new Date(),
    });
  }
}
