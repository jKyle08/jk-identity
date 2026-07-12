import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import { PasswordService } from '../../application/services/password.service';
import { normalizeEmail } from '../../utils';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
    private readonly passwordService: PasswordService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string) {
    const normalizedEmail = normalizeEmail(email);
    const credentials = await this.identityRepository.findPasswordHashByEmail(normalizedEmail);

    if (!credentials) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.passwordService.verify(credentials.passwordHash, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const identity = await this.identityRepository.findById(credentials.identityId);
    if (!identity) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return identity;
  }
}
