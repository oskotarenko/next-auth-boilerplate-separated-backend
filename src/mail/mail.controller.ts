import { MailService } from 'src/mail/mail.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SendMailDto } from './types/mail.dto';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('/send-verification-email')
  sendVerificationEmail(@Body() dto: SendMailDto) {
    return this.mailService.sendVerificationEmail(dto);
  }

  @Post('/send-reset-password')
  sendResetPasswordEmail(@Body() dto: SendMailDto) {
    return this.mailService.sendResetPasswordEmail(dto);
  }

  @Post('/send-two-factor-email')
  sendTwoFactorTokenEmail(@Body() dto: SendMailDto) {
    return this.mailService.sendTwoFactorTokenEmail(dto);
  }
}
