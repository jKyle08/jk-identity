import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { EmailVerificationService } from '../../application/services/email-verification.service';
import { PasswordResetService } from '../../application/services/password-reset.service';
import { SessionService } from '../../application/services/session.service';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ResendVerificationDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  RefreshTokenDto,
} from '../dto';
import { JwtAuthGuard, GoogleAuthGuard } from '../guards';
import { CurrentIdentity } from '../decorators';
import { toAuthResponse, toIdentityResponse } from '../interceptors/auth-response.mapper';
import { parseUserAgent } from '../../utils/password';
import { SessionExpiredException } from '../../utils/exceptions';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly passwordResetService: PasswordResetService,
    private readonly sessionService: SessionService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new identity' })
  async register(@Body() dto: RegisterDto) {
    const identity = await this.registerUseCase.execute(dto);
    return { identity: toIdentityResponse(identity) };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const userAgent = parseUserAgent(req.headers['user-agent']);
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        ...userAgent,
      },
    });

    return toAuthResponse(result.identity, result);
  }

  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current session' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentIdentity('identityId') identityId: string,
    @CurrentIdentity('sessionId') sessionId: string,
  ) {
    await this.logoutUseCase.execute({ identityId, sessionId });
  }

  @Post('logout-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout all sessions' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@CurrentIdentity('identityId') identityId: string) {
    await this.logoutUseCase.execute({ identityId, allSessions: true });
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.emailVerificationService.verifyEmail(dto.token);
    return { message: 'Email verified successfully' };
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    await this.emailVerificationService.sendVerificationEmail(dto.identityId);
    return { message: 'Verification email sent' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.passwordResetService.requestPasswordReset(dto.email);
    return { message: 'If the email exists, a reset link has been sent' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.passwordResetService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Password reset successfully' };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentIdentity('identityId') identityId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.changePasswordUseCase.execute({
      identityId,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
    return { message: 'Password changed successfully' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    try {
      const result = await this.sessionService.refreshSession(dto.refreshToken);
      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        accessTokenExpiresAt: result.accessTokenExpiresAt,
        refreshTokenExpiresAt: result.refreshTokenExpiresAt,
      };
    } catch {
      throw new SessionExpiredException();
    }
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Redirect handled by Passport
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request) {
    const result = req.user as Awaited<ReturnType<LoginUseCase['execute']>>;
    return toAuthResponse(result.identity, result);
  }
}
