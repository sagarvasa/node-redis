import { Response } from 'express';
import { IPopulatedOtpDocument, ILooseObj, OtpMode } from '../types';
import { CustomError, ErrorConst } from '../utilities/errors';
import { Constants } from '../utilities/constants';
import redisHelper from '../helpers/redis-connector';
import logger from '../utilities/winston';
import otpConfig from '../config/otp';
import genericUtilities from '../utilities/generic-utilities';

export class CoreService {
  async validateAndGenerateOtp(globalKey: string, otpKey: string, mode: OtpMode, value: string, res?: Response) {
    let payload = {
      message: Constants.OTP_SUCCESS,
      customCode: 1,
      key: value,
    };
    try {
      const globalOtpResp = await redisHelper.getValue(globalKey);
      if (globalOtpResp === null || globalOtpResp === undefined) {
        redisHelper.setValue(globalKey, '1', otpConfig.globalTtl);
        payload = await this.validateAndSetOtpTimeline(otpKey, mode, value, res);
      } else if (parseInt(globalOtpResp) <= otpConfig.maxAttempts) {
        await redisHelper.incrementValue(globalKey);
        payload = await this.validateAndSetOtpTimeline(otpKey, mode, value, res);
      } else {
        payload['message'] = ErrorConst.OTP_LIMIT_REACHED;
        payload['customCode'] = ErrorConst.OTP_LIMIT_REACHED_CODE;
      }
      return payload;
    } catch (err) {
      logger.info('[core-services][validateAndGenerateOtp][err] ' + err.message, res, true);
      payload['message'] = err.message;
      payload['customCode'] = ErrorConst.OTP_GENERIC_ERROR_CODE;

      return payload;
    }
  }

  async validateAndSetOtpTimeline(otpKey: string, mode: OtpMode, value: string, res?: Response) {
    const payload = {
      message: Constants.OTP_SUCCESS,
      customCode: 1,
      key: value,
    };
    try {
      const otpObj = {
        otp: '',
        attempt: 1,
      };

      const otpResp = await redisHelper.getValue(otpKey);
      if (otpResp === null || otpResp === undefined) {
        const generatedOtp = this.generateRandomNumber(Constants.OTP_LENGTH);
        otpObj['otp'] = generatedOtp;
        redisHelper.setValue(otpKey, JSON.stringify(otpObj), otpConfig.otpTtl);
        this.saveOtp(generatedOtp, mode, value, res)
          .then(() => {
            return this.sendOtp(generatedOtp, mode, value, res);
          })
          .then(() => {})
          .catch(err => {
            logger.info('[core-services][Save/SendOtp][err] ' + err.message, res, true);
          });
      } else {
        const parsedOtpResp = JSON.parse(otpResp);
        if (parsedOtpResp.attempt <= otpConfig.maxAttempts) {
          parsedOtpResp.attempt = parseInt(parsedOtpResp.attempt) + 1;
          let ttl = await redisHelper.ttl(otpKey);
          if (ttl <= 0) {
            ttl = otpConfig.otpTtl;
          }
          redisHelper.setValue(otpKey, JSON.stringify(parsedOtpResp), ttl);
          this.sendOtp(parsedOtpResp.otp, mode, value, res)
            .then(() => {})
            .catch(err => {
              logger.info('[core-services][Save/SendOtp][err] ' + err.message, res, true);
            });
        } else {
          payload['message'] = ErrorConst.OTP_LIMIT_REACHED;
          payload['customCode'] = ErrorConst.OTP_LIMIT_REACHED_CODE;
        }
      }
      return payload;
    } catch (err) {
      logger.info('[core-services][getOtp][err] ' + err.message, res, true);
      payload['message'] = err.message;
      payload['customCode'] = ErrorConst.OTP_GENERIC_ERROR_CODE;

      return payload;
    }
  }

  async verifyOtp(otp: string, globalKey: string, otpKey: string, mode: OtpMode, value: string, res?: Response) {
    try {
      let verifyOtpMaxAttempt = otpConfig.verifyOtpMaxAttempt || 10;
      const globalOtpResp = await redisHelper.getValue(globalKey);

      if (globalOtpResp && parseInt(globalOtpResp) > verifyOtpMaxAttempt) {
        throw new CustomError(ErrorConst.BAD_REQUEST, ErrorConst.OTP_LIMIT_REACHED);
      } else {
        let otpLimit = '1';
        if (globalOtpResp) {
          otpLimit = (parseInt(globalOtpResp) + 1).toString();
        }
        redisHelper.setValue(globalKey, otpLimit, otpConfig.verifyOtpGlobalTtl);
      }
      const otpResp = await redisHelper.getValue(otpKey);

      if (otpResp === null || otpResp === undefined) {
        throw new CustomError(ErrorConst.BAD_REQUEST, ErrorConst.OTP_EXPIRED);
      } else {
        const parsedOtpResp = JSON.parse(otpResp);
        if (parseInt(parsedOtpResp.otp) === parseInt(otp)) {
          // deleting value from redis once successfully verified
          await redisHelper.deleteValue(otpKey);

          // updating DB value for given mode & value
          /*
          this.otpRepository
            .updateOtpIsVerified(otp, mode, value, { isVerified: true }, res)
            .then(() => {})
            .catch((err: { message: string }) => {
              logger.info('[core-services][updateOtpIsVerified][err] ' + err.message, res, true);
            });
          */
          return { message: Constants.OTP_VERIFICATION_SUCCESS };
        } else {
          throw new CustomError(ErrorConst.BAD_REQUEST, ErrorConst.WRONG_OTP);
        }
      }
    } catch (err) {
      logger.info('[core-services][verifyOtp][err] ' + err.message, res, true);
      throw new CustomError(
        Number(err.status) || ErrorConst.INTERNAL_SERVER_ERROR,
        err.message || ErrorConst.GENERAL_ERROR_MSG,
      );
    }
  }

  private saveOtp(generatedOtp: string, mode: string, value: string, res?: Response) {
    return new Promise((resolve, reject) => {
      const dbObj: IPopulatedOtpDocument = {
        otp: generatedOtp,
        expiresAt: genericUtilities.addTimeOffsetInCurrentDate(new Date(), 0, otpConfig.otpTtl / 60),
        isVerified: false,
        email: '',
        phoneNumber: '',
      };
      if (mode === OtpMode.EMAIL) {
        dbObj['email'] = value;
      } else {
        dbObj['phoneNumber'] = value;
      }

      /**
       * Below code is used to store OTP record in table
       */

      /*
      this.otpRepository
        .createOtpRecord(dbObj)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          logger.info('[core-services][createOtpRecord][err] ' + err.message, res, true);
          reject(err);
        });
        */

      resolve(dbObj);
    });
  }

  private async sendOtp(generatedOtp: string, mode: string, value: string, res?: Response) {
    if (mode === OtpMode.EMAIL) {
      await this.sendOtpEmail(generatedOtp, value, res);
    } else {
      await this.sendOtpSms(generatedOtp, value, res);
    }
  }

  private async sendOtpEmail(generatedOtp: string, email: string, res?: Response) {
    /**
     * Below code can be used to send OTP via email
     */
    const from = Constants.MAIL_HANDLER;
    const subject = Constants.MAIL_SUBJECT_OTP + generatedOtp;

    logger.info('[core-services][sendOtpEmail][OTP]', res, true);
    logger.info(`************************
    ${subject}
    ************************`);
    //return mailHelper.sendOtpMail(generatedOtp, from, email, subject, res);
  }

  private sendOtpSms(generatedOtp: string, phoneNumber: string, res?: Response) {
    /**
     * Below code can be used to send OTP via sms
     */
    const mask = Constants.SMS_MASK;
    const message = Constants.OTP_MSG + generatedOtp;

    logger.info('[core-services][sendOtpSms][OTP]', res, true);
    logger.info(`************************
    ${message}
    ************************`);
    //return smsHelper.sendSms(mask, phoneNumber, message, Constants.COUNTRY_CODE_INDIA, Constants.IND_DIALING_CODE, res);
  }

  private generateRandomNumber(len: number) {
    return String(genericUtilities.generateRandomNumber(len));
  }
}
