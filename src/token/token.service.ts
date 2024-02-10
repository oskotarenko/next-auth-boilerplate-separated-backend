import { randomInt } from 'crypto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ResetPasswordToken,
  TwoFactorToken,
  VerificationToken,
} from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  // ! Generate Methods

  public async generateVerificationToken(
    email: string
  ): Promise<VerificationToken> {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

    const existingToken = await this.getVerificationTokenByEmail(email);
    if (existingToken) {
      await this.prisma.verificationToken.delete({
        where: { id: existingToken.id },
      });
    }

    const verificationToken = await this.prisma.verificationToken.create({
      data: { email, token, expires },
    });
    return verificationToken;
  }

  public async generateResetPasswordToken(
    email: string
  ): Promise<ResetPasswordToken> {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

    const existingToken = await this.getResetPasswordTokenByEmail(email);
    if (existingToken) {
      await this.prisma.resetPasswordToken.delete({
        where: { id: existingToken.id },
      });
    }

    const passwordResetToken = await this.prisma.resetPasswordToken.create({
      data: { email, token, expires },
    });
    return passwordResetToken;
  }

  public async generateTwoFactorToken(email: string): Promise<TwoFactorToken> {
    const token = randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

    const existingToken = await this.getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await this.prisma.twoFactorToken.delete({
        where: { id: existingToken.id },
      });
    }

    const twoFactorToken = await this.prisma.twoFactorToken.create({
      data: { email, token, expires },
    });
    return twoFactorToken;
  }

  // ! Get Methods

  public async getVerificationTokenByEmail(
    email: string
  ): Promise<VerificationToken | null> {
    try {
      const verificationToken = await this.prisma.verificationToken.findFirst({
        where: { email },
      });
      return verificationToken;
    } catch {
      return null;
    }
  }

  public async getVerificationTokenByToken(token: string) {
    try {
      const verificationToken = await this.prisma.verificationToken.findUnique({
        where: { token },
      });
      return verificationToken;
    } catch {
      return null;
    }
  }

  public async getResetPasswordTokenByEmail(
    email: string
  ): Promise<ResetPasswordToken | null> {
    try {
      const passwordResetToken = await this.prisma.resetPasswordToken.findFirst(
        { where: { email } }
      );
      return passwordResetToken;
    } catch {
      return null;
    }
  }

  public async getResetPasswordTokenByToken(
    token: string
  ): Promise<ResetPasswordToken | null> {
    try {
      const passwordResetToken =
        await this.prisma.resetPasswordToken.findUnique({ where: { token } });
      return passwordResetToken;
    } catch {
      return null;
    }
  }

  public async getTwoFactorTokenByEmail(
    email: string
  ): Promise<TwoFactorToken | null> {
    try {
      const twoFactorToken = await this.prisma.twoFactorToken.findFirst({
        where: { email },
      });
      return twoFactorToken;
    } catch {
      return null;
    }
  }

  public async getTwoFactorTokenByToken(
    token: string
  ): Promise<TwoFactorToken | null> {
    try {
      const twoFactorToken = await this.prisma.twoFactorToken.findUnique({
        where: { token },
      });
      return twoFactorToken;
    } catch {
      return null;
    }
  }
}
