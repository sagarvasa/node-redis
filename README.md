# node-redis


# Redis keys

export const GLOBAL_PHONE_OTP_LIMIT_KEY = 'redis::phone:globalOtp::';<br />
export const GLOBAL_EMAIL_OTP_LIMIT_KEY = 'redis::email:globalOtp::';<br />
export const PHONE_OTP_KEY = 'redis::phone::otp::';<br />
export const EMAIL_OTP_KEY = 'redis::email::otp::';<br />
export const GLOBAL_VERIFY_PHONE_OTP_LIMIT_KEY = 'redis::phone:globalVerifyOtp::';<br />
export const GLOBAL_VERIFY_EMAIL_OTP_LIMIT_KEY = 'redis::email:globalVerifyOtp::';<br />

Key name will be constant + (**either phoneNumber or email).

# Global OTP keys:

Value - Attempt (number)<br />
TTL - 1 day

Global OTP key is to limit number of attempt (send/resend) in given TTL (TTL is of 1 day)<br />
Global OTP key for email and phone is kept different in order to have more control over both entities. <br />

# OTP Keys:

Value - {otp (string) , attempt(number) } (string - JSON.stringify(givenObj))<br />
TTL - 10 mins<br />

OTP Keys are used by send and verify OTP API in order to limit the number of attempts in a given TTL.
In a given TTL, if OTP is re-requested via Resend OTP, we will increment the attempt count and send the same OTP again.
OTP needs to be verified in given TTL. Once OTP is verified we will remove the OTP keys of **(email or phone number) from redis.

# Global Verify OTP Keys:

Value - Attempt (number)<br />
TTL - 5 mins<br />

Global Verify OTP key is to limit number of attempt in verifying OTP in given TTL <br />

Attempts, TTL are configurable for all keys.<br />
OTP length - 6 (configurable)<br />

# DB Schema

Otp - string<br />
phoneNumber - string<br />
Email - string<br />
expiresAt - Timestamp<br />
isVerified - Boolean<br />
createdAt / updatedAt - Timestamp<br />








