import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  isURL,
} from 'class-validator';
import {
  genEmptyMessage,
  genInvalidMessage,
} from 'src/lib/dto-error.generator';

export class GetUserByEmailDto {
  @IsNotEmpty({ message: genEmptyMessage('email') })
  @IsEmail({}, { message: genInvalidMessage('email') })
  readonly email: string;
}

export class GetUserByIdDto {
  @IsNotEmpty({ message: genEmptyMessage('user id') })
  @IsString({ message: genInvalidMessage('user id') })
  readonly userId: string;
}

export class UpdateSettingsDto {
  @IsNotEmpty({ message: genEmptyMessage('user id') })
  @IsString({ message: genInvalidMessage('user id') })
  readonly userId: string;

  @IsOptional()
  @IsString({ message: genInvalidMessage('name') })
  readonly name?: string;

  @IsOptional()
  @IsEmail({}, { message: genInvalidMessage('email') })
  email?: string;

  @IsOptional()
  @IsDateString({}, { message: genInvalidMessage('email verified parameter') })
  readonly emailVerified: string;

  @IsOptional()
  @IsUrl({}, { message: genInvalidMessage('image url') })
  readonly image: string;

  @IsOptional()
  @IsEnum(UserRole, { message: genInvalidMessage('role') })
  readonly role: UserRole;

  @IsOptional()
  @IsBoolean({ message: genInvalidMessage('is two factor enabled parameter') })
  isTwoFactorEnabled: boolean;
}
