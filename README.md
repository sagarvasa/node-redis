# node-redis
POC on OTP logic using node & redis.
# Steps to start and configure server
1. Clone/Fork the repo in your workspace
2. Install the dependancies using `npm install`
3. Set up environment if applicable in root index.ts (global.env)
4. Run your redis server and change configuration at src/config/redis.js if applicable
5. Run command `npm start` to start the server locally
6. (Only applicable on running on docker) Use `npm run docker:build` & `npm run docker:run` to build and run on docker
# API
1. Send OTP Mobile 
curl --location --request POST 'http://localhost:3000/v1/api/otp/generate.json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "phoneNumber": 9090909090
}'

2. Send OTP Email
curl --location --request POST 'http://localhost:3000/v1/api/otp/generate.json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "abc@gmail.com"
}'

3. Verify OTP Mobile
curl --location --request POST 'http://localhost:3000/v1/api/otp/verify.json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mode": "phoneNumber",
    "value": 9090909090,
    "otp": "390912"
}'

4. Verify OTP Email
curl --location --request POST 'http://localhost:3000/v1/api/otp/verify.json' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mode": "email",
    "value": "abc@gmail.com",
    "otp": "390412"
}'

Note: OTP will be printed on server console since sms & email integration is not part of this POC

# Redis keys

![OTP Constants](/public/images/otp_constant.png)
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

# Flow diagram
 
Send OTP: 
![Send OTP](/public/images/node_redis_send_otp.png)

Verify OTP:
![Verify OTP](/public/images/node_redis_verify_otp.png)