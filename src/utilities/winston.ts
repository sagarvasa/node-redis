import { Response } from 'express';
import { transports, createLogger, format } from 'winston';
import util from 'util';

const { combine, timestamp, colorize, simple } = format;
import { Constants } from './constants';

const env = process.env.NODE_ENV ?? Constants.ENV_LOCAL;

const winstonLogger = createLogger({
  format: combine(colorize({ all: true }), timestamp(), simple()),
  transports: [new transports.Console()],
});

class Logger {
  private env: string | undefined;
  private logger;

  constructor() {
    this.env = env;
    this.logger = winstonLogger;
    this.info = this.info.bind(this);
  }

  public info(msg: string, res?: Response, timed?: boolean, error?: Error) {
    msg = util.format('[Worker : %s][%s] %s', process.pid, this.env, msg);

    if (res?.get(Constants.CORR_ID)) {
      msg = util.format('[Request : %s]%s', res.get(Constants.CORR_ID), msg);
    }

    if (res && timed && res?.get(Constants.INIT_TIME)) {
      msg = util.format('%s => %dms', msg, Date.now() - parseInt(res.get(Constants.INIT_TIME)));
    }

    this.logger.info(msg);

    if (error) {
      let errorMsg = util.format('[Worker : %s][%s]', process.pid, this.env);

      if (res?.get(Constants.CORR_ID)) {
        msg = util.format('[Request : %s]%s %s', res.get(Constants.CORR_ID), errorMsg, error.message);
      }

      errorMsg = util.format('%s Stack : %s', errorMsg, error.stack);

      this.logger.info(errorMsg);
    }
  }
}

export default new Logger();
