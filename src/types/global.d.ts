/* eslint-disable  @typescript-eslint/no-explicit-any */
declare namespace NodeJS {
  interface Global {
    env: string;
  }

  interface Process {
    currentRes: any;
  }
}
