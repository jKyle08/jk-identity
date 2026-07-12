import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { JwtTokenService } from '../../../src/infrastructure/jwt/jwt-token.service';
import { IDENTITY_MODULE_OPTIONS } from '../../../src/config/identity-module.options';
import { TOKEN_SERVICE } from '../../../src/domain/ports/token-service.port';
import { TEST_AUTH_CONFIG } from '../../helpers/test-module.factory';

describe('JwtTokenService', () => {
  let tokenService: JwtTokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: TEST_AUTH_CONFIG.jwtSecret,
          signOptions: { expiresIn: '15m' },
        }),
      ],
      providers: [
        JwtTokenService,
        {
          provide: IDENTITY_MODULE_OPTIONS,
          useValue: { auth: TEST_AUTH_CONFIG },
        },
        { provide: TOKEN_SERVICE, useExisting: JwtTokenService },
      ],
    }).compile();

    tokenService = module.get(JwtTokenService);
  });

  it('generates and verifies access tokens', async () => {
    const token = await tokenService.generateAccessToken({
      sub: 'id-1',
      sessionId: 'session-1',
      email: 'user@example.com',
    });

    const payload = await tokenService.verifyAccessToken(token);
    expect(payload.sub).toBe('id-1');
    expect(payload.sessionId).toBe('session-1');
  });

  it('hashes and verifies refresh tokens', async () => {
    const plain = await tokenService.generateRefreshToken();
    const hash = await tokenService.hashToken(plain);
    expect(await tokenService.verifyTokenHash(plain, hash)).toBe(true);
    expect(await tokenService.verifyTokenHash('wrong-token', hash)).toBe(false);
  });
});
