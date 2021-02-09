export namespace Constants {
  // Logger Constants
  export const INIT_TIME = 'watchdog_init';
  export const CORR_ID = 'watchdog_cr_id';

  // Env names
  export const ENV_LOCAL = 'local';
  export const ENV_DEV = 'dev';
  export const ENV_PROD = 'production';

  export const GLOBAL_PHONE_OTP_LIMIT_KEY = 'redis::phone:globalOtp::';
  export const GLOBAL_EMAIL_OTP_LIMIT_KEY = 'redis::email:globalOtp::';
  export const PHONE_OTP_KEY = 'redis::phone::otp::';
  export const EMAIL_OTP_KEY = 'redis::email::otp::';
  export const GLOBAL_VERIFY_PHONE_OTP_LIMIT_KEY = 'redis::phone:globalVerifyOtp::';
  export const GLOBAL_VERIFY_EMAIL_OTP_LIMIT_KEY = 'redis::email:globalVerifyOtp::';

  export const OTP_SUCCESS = 'OTP sent sucessfully';
  export const OTP_LENGTH = 6;

  export const MAIL_HANDLER = 'noreply@noderedis.com';
  export const MAIL_SUBJECT_OTP = 'Your OTP for portal is ';
  export const SMS_MASK = 'NDRDS';
  export const OTP_MSG = 'Hi, Your OTP for portal is ';

  export const COUNTRY_CODE_INDIA = 'IND';
  export const IND_DIALING_CODE = '+91';
  export const COUNTRY_CODE_UAE = 'UAE';
}
