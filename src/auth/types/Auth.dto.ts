import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  genEmptyMessage,
  genInvalidMessage,
} from 'src/lib/dto-error.generator';

export class LoginDto {
  @IsNotEmpty({ message: genEmptyMessage('email') })
  @IsEmail({}, { message: genInvalidMessage('email') })
  readonly email: string;

  @IsOptional()
  @IsString({ message: genInvalidMessage('code') })
  readonly code?: string;
}

export class RegisterDto {
  @IsNotEmpty({ message: genEmptyMessage('email') })
  @IsEmail({}, { message: genInvalidMessage('email') })
  readonly email: string;

  @IsNotEmpty({ message: genEmptyMessage('password') })
  @IsString({ message: genInvalidMessage('password') })
  readonly password: string;

  @IsNotEmpty({ message: genEmptyMessage('name') })
  @IsString({ message: genInvalidMessage('name') })
  readonly name: string;
}

export class NewVerificationDto {
  @IsNotEmpty({ message: genEmptyMessage('verification token') })
  @IsString({ message: genInvalidMessage('verification token') })
  readonly token: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: genEmptyMessage('email') })
  @IsEmail({}, { message: genInvalidMessage('email') })
  readonly email: string;
}
export class NewPasswordDto {
  @IsNotEmpty({ message: genEmptyMessage('password') })
  @IsString({ message: genInvalidMessage('password') })
  readonly password: string;

  @IsNotEmpty({ message: genEmptyMessage('token') })
  @IsString({ message: genInvalidMessage('token') })
  readonly token: string;
}
