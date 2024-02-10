import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { SendMailDto } from './types/mail.dto';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  public async sendVerificationEmail({ email, token }: SendMailDto) {
    const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-verification?token=${token}`;

    await this.resend.emails.send({
      from: 'auth@oskotarenko-next-auth-boilerplate.xyz',
      to: email,
      subject: 'Confirm your email',
      html: `<p><a href=${confirmLink}>Click here</a> to confirm email.</p>`,
    });
  }

  public async sendResetPasswordEmail({ email, token }: SendMailDto) {
    const resetPasswordLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/new-password?token=${token}`;

    await this.resend.emails.send({
      from: 'auth@oskotarenko-next-auth-boilerplate.xyz',
      to: email,
      subject: 'Reset your password',
      html: `<p><a href=${resetPasswordLink}>Click here</a> to reset password.</p>`,
    });
  }

  public async sendTwoFactorTokenEmail({ email, token }: SendMailDto) {
    await this.resend.emails.send({
      from: 'auth@oskotarenko-next-auth-boilerplate.xyz',
      to: email,
      subject: 'Two Factor Confirmation',
      html: `<p>Your 2FA code: ${token}</p>`,
    });
  }
}
