const env: keyof typeof config = global.env as keyof typeof config;

interface OTPConfig {
  maxAttempts: number;
  otpTtl: number;
  verifyOtpMaxAttempt?: number;
  globalTtl?: number;
  verifyOtpGlobalTtl?: number;
}

/* OTP configuration based on environment */

const local: OTPConfig = {
  maxAttempts: 10,
  otpTtl: 600,
  verifyOtpMaxAttempt: 10,
  globalTtl: 86400,
  verifyOtpGlobalTtl: 300,
};

const staging: OTPConfig = {
  maxAttempts: 10,
  otpTtl: 600,
  verifyOtpMaxAttempt: 10,
  globalTtl: 86400,
  verifyOtpGlobalTtl: 300,
};

const dev: OTPConfig = {
  maxAttempts: 10,
  otpTtl: 600,
  verifyOtpMaxAttempt: 10,
  globalTtl: 86400,
  verifyOtpGlobalTtl: 300,
};

const production: OTPConfig = {
  maxAttempts: 10,
  otpTtl: 600,
  verifyOtpMaxAttempt: 10,
  globalTtl: 86400,
  verifyOtpGlobalTtl: 300,
};

const config = { local, staging, production, dev };

export default config[env];
