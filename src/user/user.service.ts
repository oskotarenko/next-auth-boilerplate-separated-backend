import { AuthService } from './../auth/auth.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GetUserByEmailDto,
  GetUserByIdDto,
  UpdateSettingsDto,
} from './types/user.dto';
import { ApiMessageResponse } from 'src/lib/api.response';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService
  ) {}

  async getUserByEmail({
    email,
  }: GetUserByEmailDto): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email },
      });
      return user;
    } catch {
      return null;
    }
  }

  async getUserById({ userId }: GetUserByIdDto): Promise<UserModel | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      return user;
    } catch {
      return null;
    }
  }

  public async updateSettings(
    dto: UpdateSettingsDto
  ): Promise<ApiMessageResponse> {
    const user = await this.getUserById({ userId: dto.userId });
    if (!user) return { error: 'User not found' };

    const isOAuth = !!(await this.authService.getAccount(user.id));

    if (isOAuth) {
      (dto.email = undefined), (dto.isTwoFactorEnabled = undefined);
    }

    const userWithProvidedEmail = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (userWithProvidedEmail && user.id !== userWithProvidedEmail.id) {
      return { error: 'Email alredy in use' };
    }

    await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        name: dto.name,
        email: dto.email,
        emailVerified: dto.emailVerified,
        image: dto.image,
        role: dto.role,
        isTwoFactorEnabled: dto.isTwoFactorEnabled,
      },
    });

    return { success: 'Settings updated' };
  }

  async checkUserExistanceByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }
}
