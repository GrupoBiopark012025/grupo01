export class FormValidatorsUtils {
  static readonly date = {
    toString: FormValidatorsUtils.dateToString,
    toHourString: FormValidatorsUtils.hourToString,
    isValid: FormValidatorsUtils.isValidDate,
    minValidDate: FormValidatorsUtils.minValidDate
  }

  static readonly string = {
    toDate: FormValidatorsUtils.toDate
  }

  static readonly number = {
    toString: FormValidatorsUtils.numberToFormattedString
  }

  private static numberToFormattedString(value: any): string {
    if (typeof value !== 'number') { return value; }

    const isDecimal = value % 1 !== 0;

    const options = isDecimal
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : {};

    return value.toLocaleString('pt-BR', options);
  }

  private static isValidDate(value: Date | string) {
    return !!FormValidatorsUtils.toDate(value);
  }

  private static toDate(value: Date | string): Date | null {
    const date = typeof value === 'string' ? new Date(value) : value;

    if (date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())) {
      return date;
    }

    return null;
  }

  private static minValidDate(value?: Date | string): Date {
    const minDate = new Date(1900, 0, 1, 0, 0, 0, 0); // 01/01/1900
    const date = value ? FormValidatorsUtils.toDate(value) : null;

    return date && date >= minDate ? date : minDate;
  }

  private static dateToString(date: Date | string): string {
    const dt = FormValidatorsUtils.toDate(date);

    if (!dt) {
      return '';
    }

    return dt.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private static hourToString(date: Date | string): string {
    const dt = FormValidatorsUtils.toDate(date);

    if (!dt) {
      return '';
    }

    return dt.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
