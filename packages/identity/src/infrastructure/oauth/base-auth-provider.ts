import { ProviderType } from '../../domain/value-objects/provider-type';
import { AuthProvider, AuthProviderProfile } from '../../domain/ports/auth-provider.port';

export abstract class BaseAuthProvider implements AuthProvider {
  abstract readonly type: ProviderType;
  abstract authenticate(credentials: unknown): Promise<AuthProviderProfile>;
}
