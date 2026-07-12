import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SessionService } from '../../application/services/session.service';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../domain/ports/identity.repository';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../guards';
import { CurrentIdentity } from '../decorators';
import { toIdentityResponse } from '../interceptors/auth-response.mapper';
import { IdentityNotFoundException } from '../../utils/exceptions';

@ApiTags('sessions')
@ApiBearerAuth()
@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    @Inject(IDENTITY_REPOSITORY)
    private readonly identityRepository: IdentityRepository,
  ) {}

  @Get('me')
  async getCurrentIdentity(@CurrentIdentity('identityId') identityId: string) {
    const identity = await this.identityRepository.findById(identityId);
    if (!identity) {
      throw new IdentityNotFoundException();
    }
    return { identity: toIdentityResponse(identity) };
  }

  @Get()
  async listSessions(@CurrentIdentity('identityId') identityId: string) {
    const sessions = await this.sessionService.getSessions(identityId);
    return {
      sessions: sessions.map((session) => ({
        id: session.id,
        device: session.device,
        browser: session.browser,
        operatingSystem: session.operatingSystem,
        ipAddress: session.ipAddress,
        lastActivityAt: session.lastActivityAt,
        expiresAt: session.expiresAt,
        isActive: session.isActive(),
      })),
    };
  }

  @Delete(':sessionId')
  async revokeSession(
    @CurrentIdentity('identityId') identityId: string,
    @Param('sessionId') sessionId: string,
  ) {
    await this.sessionService.revokeSession(identityId, sessionId);
    return { message: 'Session revoked' };
  }
}
