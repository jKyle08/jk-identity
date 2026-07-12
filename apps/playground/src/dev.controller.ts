import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { adapters } from './adapters';

/**
 * Playground-only helper routes for inspecting in-memory adapter state.
 * Not for production use.
 */
@ApiTags('dev')
@Controller('dev')
export class DevController {
  @Get('emails')
  @ApiOperation({
    summary: 'List captured emails (playground only)',
    description:
      'Memory adapters do not send real email. Use this endpoint to retrieve verification or password-reset tokens.',
  })
  @ApiQuery({ name: 'email', required: false, example: 'jane@example.com' })
  listEmails(@Query('email') email?: string) {
    if (email) {
      return {
        email,
        verificationToken: adapters.emailAdapter.getLastVerificationToken(email),
        passwordResetToken: adapters.emailAdapter.getLastPasswordResetToken(email),
      };
    }

    return {
      emails: adapters.emailAdapter.sentEmails.map((record) => ({
        to: record.to,
        type: record.type,
        token: record.token,
        sentAt: record.sentAt,
      })),
    };
  }
}
