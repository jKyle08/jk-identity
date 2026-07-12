export interface LoginHistoryProps {
  id: string;
  identityId: string;
  success: boolean;
  ipAddress?: string | null;
  userAgent?: string | null;
  device?: string | null;
  browser?: string | null;
  operatingSystem?: string | null;
  failureReason?: string | null;
  createdAt: Date;
}

export class LoginHistory {
  private constructor(private readonly props: LoginHistoryProps) {}

  static create(
    props: Omit<LoginHistoryProps, 'createdAt'> & { createdAt?: Date },
  ): LoginHistory {
    return new LoginHistory({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    });
  }

  static reconstitute(props: LoginHistoryProps): LoginHistory {
    return new LoginHistory(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get success(): boolean {
    return this.props.success;
  }

  get ipAddress(): string | null | undefined {
    return this.props.ipAddress;
  }

  get userAgent(): string | null | undefined {
    return this.props.userAgent;
  }

  get device(): string | null | undefined {
    return this.props.device;
  }

  get browser(): string | null | undefined {
    return this.props.browser;
  }

  get operatingSystem(): string | null | undefined {
    return this.props.operatingSystem;
  }

  get failureReason(): string | null | undefined {
    return this.props.failureReason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  toProps(): LoginHistoryProps {
    return { ...this.props };
  }
}
