import { AuthService } from './auth.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  LoginDto,
  RegisterDto,
  NewVerificationDto,
  ResetPasswordDto,
  NewPasswordDto,
} from './types/Auth.dto';
import { ApiMessageResponse } from 'src/lib/api.response';
import { Account, TwoFactorConfirmation } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    console.log(dto);
    return await this.authService.login(dto);
  }

  @Post('/register')
  register(@Body() dto: RegisterDto): Promise<ApiMessageResponse> {
    return this.authService.register(dto);
  }

  @Post('/new-verification')
  newVerification(
    @Body() dto: NewVerificationDto
  ): Promise<ApiMessageResponse> {
    return this.authService.newVerification(dto);
  }

  @Post('/reset-password')
  resetPassword(@Body() dto: ResetPasswordDto): Promise<ApiMessageResponse> {
    return this.authService.resetPassword(dto);
  }

  @Post('/new-password')
  newPassword(@Body() dto: NewPasswordDto): Promise<ApiMessageResponse> {
    return this.authService.newPassword(dto);
  }

  @Get('/two-factor-confirmation/:userId')
  getTwoFactorConfirmation(
    @Param('userId') userId: string
  ): Promise<TwoFactorConfirmation | null> {
    return this.authService.getTwoFactorConfirmation(userId);
  }

  @Delete('/two-factor-confirmation/:confirmationId')
  deleteTwoFactorConfirmation(@Param('confirmationId') confirmationId: string) {
    return this.authService.deleteTwoFactorConfirmation(confirmationId);
  }

  @Get('/account/:userId')
  getAccount(@Param('userId') userId: string): Promise<Account | null> {
    return this.authService.getAccount(userId);
  }
}
