export type ApiMessageResponse =
  | {
      readonly success: string;
    }
  | {
      readonly error: string;
    };
