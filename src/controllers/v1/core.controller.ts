import { Request, Response } from 'express';
import { CustomError, ErrorConst } from '../../utilities/errors';
import { OtpMode } from '../../types';
import { CoreService } from '../../services';
import { Constants } from '../../utilities/constants';
import logger from '../../utilities/winston';

export class CoreController {
  private coreService;

  constructor() {
    // bind 'this' here in case of normal functions(methods). For arrow functions it is not required
    this.coreService = new CoreService();
  }

  generateOTP = async (req: Request, res: Response) => {
    try {
      let { body } = req;
      let mode = OtpMode.PHONE_NUMBER;
      let value = body.phoneNumber;
      let globalKey = '';
      let otpKey = '';
      if (body.phoneNumber) {
        globalKey = Constants.GLOBAL_PHONE_OTP_LIMIT_KEY + body.phoneNumber;
        otpKey = Constants.PHONE_OTP_KEY + body.phoneNumber;
      } else if (body.email) {
        mode = OtpMode.EMAIL;
        globalKey = Constants.GLOBAL_EMAIL_OTP_LIMIT_KEY + body.email;
        otpKey = Constants.EMAIL_OTP_KEY + body.email;
        value = body.email;
      } else {
        throw new CustomError(ErrorConst.BAD_REQUEST, ErrorConst.VALIDATION_ERROR_MSG);
      }

      const resp = await this.coreService.validateAndGenerateOtp(globalKey, otpKey, mode, value, res);
      return res.status(200).send(resp);
    } catch (err) {
      this.logMessages('[generateOTP][err] ' + err.message, res, true);
      return res.status(err.status || ErrorConst.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const { mode, value, otp } = req.body;
      let globalKey = '';
      let otpKey = '';
      if (mode === OtpMode.PHONE_NUMBER) {
        otpKey = Constants.PHONE_OTP_KEY + value;
        globalKey = Constants.GLOBAL_VERIFY_PHONE_OTP_LIMIT_KEY + value;
      } else if (mode === OtpMode.EMAIL) {
        otpKey = Constants.EMAIL_OTP_KEY + value;
        globalKey = Constants.GLOBAL_VERIFY_EMAIL_OTP_LIMIT_KEY + value;
      } else {
        throw new CustomError(ErrorConst.BAD_REQUEST, ErrorConst.VALIDATION_ERROR_MSG);
      }

      if (!value || !otp) {
        throw new CustomError(ErrorConst.BAD_REQUEST, ErrorConst.VALIDATION_ERROR_MSG);
      }

      let resp = await this.coreService.verifyOtp(otp, globalKey, otpKey, mode, value, res);
      return res.status(200).send(resp);
    } catch (err) {
      this.logMessages('[verifyOTP][err] ' + err.message, res, true);
      return res.status(err.status || ErrorConst.INTERNAL_SERVER_ERROR).send({ message: err.message });
    }
  };

  private logMessages(msg: string, res?: Response, timed?: boolean, err?: Error) {
    logger.info(`[node-redis][controllers][v1][core] ${msg}`, res, timed, err);
  }
}
