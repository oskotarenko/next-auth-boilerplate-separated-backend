import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';
import {
  genEmptyMessage,
  genInvalidMessage,
} from 'src/lib/dto-error.generator';

export class SendMailDto {
  @IsNotEmpty({ message: genEmptyMessage('email') })
  @IsEmail({}, { message: genInvalidMessage('email') })
  readonly email: string;

  @IsNotEmpty({ message: genEmptyMessage('token') })
  @IsUUID('all', { message: genInvalidMessage('token') })
  readonly token: string;
}
