import { formatDate } from 'src/utils/format';

export class ValidationError extends Error {
  constructor(
    public period: {
      startingDate?: Date;
      endingDate?: Date;
    },
    public errorAmount: number
  ) {
    super();
  }

  toString() {
    const period =
      this.period.startingDate === undefined
        ? `before ${formatDate(this.period.endingDate)} `
        : this.period.endingDate === undefined
          ? `after ${formatDate(this.period.startingDate)} `
          : `between ${formatDate(this.period.startingDate)} and ${formatDate(this.period.endingDate)}`;
    return `${this.errorAmount > 0 ? 'Missing' : 'Excess'} ${this.errorAmount} ${period}`;
  }
}
