class GenericUtilities {
  public generateRandomNumber(length: number) {
    let min = '1';
    let max = '9';
    for (let i = 1; i < length; i++) {
      min += '0';
      max += '9';
    }

    return Math.floor(Math.random() * (Number(max) - Number(min) + 1)) + Number(min);
  }

  public addTimeOffsetInCurrentDate(date: Date, hours: number, minutes: number) {
    const currentTime = date.getTime();
    let timeinMs = 0;
    if (hours) {
      timeinMs = timeinMs + hours * 60 * 60 * 1000;
    }
    if (minutes) {
      timeinMs = timeinMs + minutes * 60 * 1000;
    }

    return new Date(currentTime + timeinMs);
  }

  public getDurationBetweenDates(toDate: Date, fromDate: Date) {
    const fromDuration: Date = new Date(fromDate);
    const toDuration: Date = new Date(toDate);
    const diffTime = toDuration.valueOf() - fromDuration.valueOf();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }
}

export default new GenericUtilities();
