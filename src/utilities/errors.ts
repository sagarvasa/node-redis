export namespace ErrorConst {
  // Http codes
  export const BAD_REQUEST = 400;
  export const UNAUTHORIZED = 401;
  export const FORBIDDEN = 403;
  export const NOT_FOUND = 404;
  export const REQUEST_TIME_OUT = 408;
  export const CONFLICT = 409;
  export const INTERNAL_SERVER_ERROR = 500;
  export const BAD_GATEWAY = 502;
  export const SERVICE_UNAVAILABLE = 503;
  export const GATEWAY_TIMEOUT = 504;

  // Error Messages
  export const GENERAL_ERROR_MSG = 'Internal Server Error';
  export const HANDLER_NOT_FOUND = 'Requested resource not found';
  export const INVALID_URI_FORMAT = 'Invalid URI format';
  export const VALIDATION_ERROR_MSG = 'Please pass valid payload';
  export const REQUEST_ERROR = 'The request was made but no response was received';

  export const OTP_LIMIT_REACHED = 'Please try again after some time';
  export const OTP_EXPIRED = 'Please regenerate new OTP';
  export const WRONG_OTP = 'Please enter correct OTP';

  // Custom error codes
  export const OTP_LIMIT_REACHED_CODE = 3;
  export const OTP_GENERIC_ERROR_CODE = 4;
}

export class CustomError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.status = status;
  }
}
