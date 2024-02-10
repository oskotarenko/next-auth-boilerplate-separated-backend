import { ApiMessageResponse } from '../../lib/api.response';

export type LoginResponse =
  | ApiMessageResponse
  | { twoFactor?: boolean; confirmed?: boolean };
export type RegisterResponse = ApiMessageResponse;
export type NewVerificationResponse = ApiMessageResponse;
export type ResetPasswordResponse = ApiMessageResponse;
