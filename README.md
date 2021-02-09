# node-redis

Redis keys

 `
  export const GLOBAL_PHONE_OTP_LIMIT_KEY = 'redis::phone:globalOtp::';
  export const GLOBAL_EMAIL_OTP_LIMIT_KEY = 'redis::email:globalOtp::';
  export const PHONE_OTP_KEY = 'redis::phone::otp::';
  export const EMAIL_OTP_KEY = 'redis::email::otp::';
  export const GLOBAL_VERIFY_PHONE_OTP_LIMIT_KEY = 'redis::phone:globalVerifyOtp::';
  export const GLOBAL_VERIFY_EMAIL_OTP_LIMIT_KEY = 'redis::email:globalVerifyOtp::';
 `

Key name will be constant + (**either phoneNumber or email).

Global OTP keys:

Value - Attempt (number)
TTL - 1 day

Global OTP key is to limit number of attempt (send/resend) in given TTL (TTL is of 1 day)
Global OTP key for email and phone is kept different in order to have more control over both entities. 

OTP Keys:

Value - {otp (string) , attempt(number) } (string - JSON.stringify(givenObj))
TTL - 10 mins

OTP Keys are used by send and verify OTP API in order to limit the number of attempts in a given TTL.
In a given TTL, if OTP is re-requested via Resend OTP, we will increment the attempt count and send the same OTP again.
OTP needs to be verified in given TTL. Once OTP is verified we will remove the OTP keys of **(email or phone number) from redis.

Global Verify OTP Keys:

Value - Attempt (number)
TTL - 5 mins

Global Verify OTP key is to limit number of attempt in verifying OTP in given TTL 

Attempts, TTL are configurable for all keys.
OTP length - 4 (configurable)

DB Schema

Otp - string
phoneNumber - string
Email - string
expiresAt - Timestamp
isVerified - Boolean
createdAt / updatedAt - Timestamp








