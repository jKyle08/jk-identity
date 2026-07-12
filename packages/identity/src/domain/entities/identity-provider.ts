import { ProviderType } from '../value-objects/provider-type';

export interface IdentityProviderProps {
  id: string;
  identityId: string;
  provider: ProviderType;
  providerUserId: string;
  email?: string | null;
  metadata?: Record<string, unknown> | null;
  linkedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class IdentityProvider {
  private constructor(private readonly props: IdentityProviderProps) {}

  static create(
    props: Omit<IdentityProviderProps, 'createdAt' | 'updatedAt' | 'linkedAt'> & {
      linkedAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    },
  ): IdentityProvider {
    const now = new Date();
    return new IdentityProvider({
      ...props,
      linkedAt: props.linkedAt ?? now,
      createdAt: props.createdAt ?? now,
      updatedAt: props.updatedAt ?? now,
    });
  }

  static reconstitute(props: IdentityProviderProps): IdentityProvider {
    return new IdentityProvider(props);
  }

  get id(): string {
    return this.props.id;
  }

  get identityId(): string {
    return this.props.identityId;
  }

  get provider(): ProviderType {
    return this.props.provider;
  }

  get providerUserId(): string {
    return this.props.providerUserId;
  }

  get email(): string | null | undefined {
    return this.props.email;
  }

  get metadata(): Record<string, unknown> | null | undefined {
    return this.props.metadata;
  }

  get linkedAt(): Date {
    return this.props.linkedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toProps(): IdentityProviderProps {
    return { ...this.props };
  }
}
