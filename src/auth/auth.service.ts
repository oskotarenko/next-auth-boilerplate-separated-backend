import { MailService } from './../mail/mail.service';
import { TokenService } from './../token/token.service';
import { UserService } from './../user/user.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  LoginDto,
  RegisterDto,
  NewVerificationDto,
  ResetPasswordDto,
  NewPasswordDto,
} from './types/Auth.dto';
import { Account as AccountModel, TwoFactorConfirmation } from '@prisma/client';
import {
  LoginResponse,
  NewVerificationResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './types/Auth.response';
import { hash } from 'bcryptjs';
import { ApiMessageResponse } from 'src/lib/api.response';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private tokenService: TokenService,
    private mailService: MailService
  ) {}

  async login({ email, code }: LoginDto): Promise<LoginResponse> {
    const existingUser = await this.userService.getUserByEmail({ email });

    if (!existingUser) return { error: 'User not found' };

    if (!existingUser.email || !existingUser.password)
      return { error: 'Invalid credentials provided' };

    if (!existingUser.emailVerified) {
      const verificationToken =
        await this.tokenService.generateVerificationToken(email);
      await this.mailService.sendVerificationEmail({
        email: verificationToken.email,
        token: verificationToken.token,
      });

      return { success: 'Confirmation email sent' };
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email) {
      if (code) {
        const twoFactorToken = await this.tokenService.getTwoFactorTokenByEmail(
          existingUser.email
        );
        if (!twoFactorToken || twoFactorToken.token !== code) {
          return { error: 'Invalid code' };
        }

        const isExpired = new Date() > new Date(twoFactorToken.expires);
        if (isExpired) {
          return { error: 'Code expired' };
        }

        await this.prisma.twoFactorToken.delete({
          where: { id: twoFactorToken.id },
        });

        const existingConfirmation = await this.getTwoFactorConfirmation({
          userId: existingUser.id,
        });

        if (existingConfirmation) {
          await this.prisma.twoFactorConfirmation.delete({
            where: { id: existingConfirmation.id },
          });
        }

        await this.prisma.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id,
          },
        });
      } else {
        const twoFactorToken = await this.tokenService.generateTwoFactorToken(
          existingUser.email
        );
        await this.mailService.sendTwoFactorTokenEmail({
          email: twoFactorToken.email,
          token: twoFactorToken.token,
        });

        return { twoFactor: true };
      }
    }
    return { confirmed: true };
  }

  async register({
    email,
    password,
    name,
  }: RegisterDto): Promise<RegisterResponse> {
    const isEmailInUse = !!(await this.userService.checkUserExistanceByEmail(
      email
    ));
    if (isEmailInUse) return { error: 'Email already in use' };

    const hashPassword = await hash(password, 10);
    await this.prisma.user.create({
      data: { email, name, password: hashPassword },
    });

    const verificationToken = await this.tokenService.generateVerificationToken(
      email
    );
    await this.mailService.sendVerificationEmail({
      email: verificationToken.email,
      token: verificationToken.token,
    });

    return { success: 'Confirmation email sent' };
  }

  async newVerification({
    token,
  }: NewVerificationDto): Promise<NewVerificationResponse> {
    const existingToken = await this.tokenService.getVerificationTokenByToken(
      token
    );

    if (!existingToken) return { error: 'Token does not exist' };

    const isExpired = new Date() > new Date(existingToken.expires);
    if (isExpired) return { error: 'Token has expired' };

    const existingUser = await this.userService.getUserByEmail({
      email: existingToken.email,
    });
    if (!existingUser) return { error: 'User does not exist' };

    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email: existingUser.email,
        emailVerified: new Date(),
      },
    });

    await this.prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
    return { success: 'Email verified' };
  }

  async resetPassword({
    email,
  }: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const existingUser = await this.userService.getUserByEmail({ email });
    if (!existingUser) return { error: 'User not found' };

    const passwordResetToken =
      await this.tokenService.generateResetPasswordToken(email);

    await this.mailService.sendResetPasswordEmail({
      email: passwordResetToken.email,
      token: passwordResetToken.token,
    });

    return { success: 'Reset email sent' };
  }

  async newPassword({ token, password }: NewPasswordDto) {
    const existingToken = await this.tokenService.getResetPasswordTokenByToken(
      token
    );
    if (!existingToken) return { error: 'Token does not exist' };

    const isExpired = new Date() > new Date(existingToken.expires);
    if (isExpired) return { error: 'Token has expired' };

    const existingUser = await this.userService.getUserByEmail({
      email: existingToken.email,
    });
    if (!existingUser) return { error: 'User does not exist' };

    const hashPassword = await hash(password, 10);

    await this.prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashPassword },
    });

    await this.prisma.resetPasswordToken.delete({
      where: { id: existingToken.id },
    });

    return { success: 'Password updated' };
  }

  public async getTwoFactorConfirmation(
    userId
  ): Promise<TwoFactorConfirmation | null> {
    try {
      const twoFactorConfirmation =
        await this.prisma.twoFactorConfirmation.findUnique({
          where: { userId },
        });
      return twoFactorConfirmation;
    } catch {
      return null;
    }
  }

  public async deleteTwoFactorConfirmation(
    confirmationId: string
  ): Promise<ApiMessageResponse> {
    await this.prisma.twoFactorConfirmation.delete({
      where: { id: confirmationId },
    });
    return { success: 'Deleted successfully' };
  }

  public async getAccount(userId: string): Promise<AccountModel | null> {
    try {
      const account = await this.prisma.account.findFirst({
        where: { userId },
      });
      return account;
    } catch {
      return null;
    }
  }
}
