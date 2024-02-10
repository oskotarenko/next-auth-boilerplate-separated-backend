import { Body, Controller, Get, Post } from '@nestjs/common';
import { TokenService } from './token.service';
import {
  GenerateTokenDto,
  GetTokenByEmailDto,
  GetTokenByTokenDto,
} from './types/Token.dto';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Post('/generate/verification-token')
  generateVerificationToken(@Body() dto: GenerateTokenDto) {
    return this.tokenService.generateVerificationToken(dto.email);
  }

  @Post('/generate/reset-password-token')
  generateResetPasswordToken(@Body() dto: GenerateTokenDto) {
    return this.tokenService.generateResetPasswordToken(dto.email);
  }

  @Post('/generate/two-factor-token')
  generateTwoFactorToken(@Body() dto: GenerateTokenDto) {
    return this.tokenService.generateTwoFactorToken(dto.email);
  }

  @Get('/get/verification-token-by-email')
  getVerificationTokenByEmail(@Body() dto: GetTokenByEmailDto) {
    return this.tokenService.getVerificationTokenByEmail(dto.email);
  }

  @Get('/get/verification-token-by-token')
  getVerificationTokenByToken(@Body() dto: GetTokenByTokenDto) {
    return this.tokenService.getVerificationTokenByToken(dto.token);
  }

  @Get('/get/reset-password-token-by-email')
  getResetPasswordTokenByEmail(@Body() dto: GetTokenByEmailDto) {
    return this.tokenService.getResetPasswordTokenByEmail(dto.email);
  }

  @Get('/get/reset-password-token-by-token')
  getResetPasswordTokenByToken(@Body() dto: GetTokenByTokenDto) {
    return this.tokenService.getResetPasswordTokenByToken(dto.token);
  }

  @Get('/get/two-factor-token-by-email')
  getTwoFactorTokenByEmail(@Body() dto: GetTokenByEmailDto) {
    return this.tokenService.getTwoFactorTokenByEmail(dto.email);
  }

  @Get('/get/two-factor-token-by-token')
  getTwoFactorTokenByToken(@Body() dto: GetTokenByTokenDto) {
    return this.tokenService.getTwoFactorTokenByToken(dto.token);
  }
}
