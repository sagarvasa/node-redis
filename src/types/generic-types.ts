export interface ILooseObj {
  [key: string]: any;
}

export enum OtpMode {
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
}

export interface IOtpDocument {
  otp: string;
  expiresAt: Date;
  isVerified: boolean;
  phoneNumber?: String;
  email?: String;
}

// marker interface to distinguish actual and populated obj
export interface IPopulatedOtpDocument extends IOtpDocument {}
