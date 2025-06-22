/**
 * 日期工具類別
 *
 * @export
 * @class DateUtils
 */
export class DateUtils {

  /**
   * 加天數
   *
   * @static
   * @param {Date} date
   * @param {number} days
   * @return {*}  {Date}
   * @memberof DateUtils
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
