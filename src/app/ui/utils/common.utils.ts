/**
 * 通用工具類別
 *
 * @export
 * @class CommonUtils
 */
export class CommonUtils {
  /**
   * 深層複製物件或陣列
   *
   * @static
   * @template T
   * @param {T} obj
   * @return {*}  {T}
   * @memberof CommonUtils
   */
  static cloneDeep<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 回傳日期的星期
   *
   * @static
   * @param {Date} date
   * @return {*}  {string}
   * @memberof CommonUtils
   */
  static returnDays(date: Date): string {
    switch (date.getDay()) {
      case 0:
        return '日';
      case 1:
        return '一';
      case 2:
        return '二';
      case 3:
        return '三';
      case 4:
        return '四';
      case 5:
        return '五';
      case 6:
        return '六';
    }
    return '';
  }

  /**
   * 判斷值是否為 null 或 undefined
   *
   * @static
   * @param {*} value
   * @return {*}  {boolean}
   * @memberof CommonUtils
   */
  static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined;
  }

  /**
   * 設定日期時分秒為0
   *
   * @static
   * @param {Date} date
   * @return {*}  {Date}
   * @memberof CommonUtils
   */
  static setDateDetailToZero(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
  }
}
