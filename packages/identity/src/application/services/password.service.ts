import { Inject, Injectable } from '@nestjs/common';
import {
  PASSWORD_HASHER,
  PasswordHasher,
} from '../../domain/ports/password-hasher.port';
import { Password } from '../../domain/value-objects/password';

@Injectable()
export class PasswordService {
  constructor(
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async hash(password: string): Promise<string> {
    Password.create(password);
    return this.passwordHasher.hash(password);
  }

  async verify(hash: string, password: string): Promise<boolean> {
    return this.passwordHasher.verify(hash, password);
  }

  validateStrength(password: string): void {
    Password.create(password);
  }
}
