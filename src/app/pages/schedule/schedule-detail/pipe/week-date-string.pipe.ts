import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weekDateString'
})
export class WeekDateStringPipe implements PipeTransform {

  /**
   * 將日期轉換為星期字串
   *
   * @param {unknown} value
   * @param {...unknown[]} args
   * @return {*}  {unknown}
   * @memberof WeekDateStringPipe
   */
  transform(value: Date, ...args: unknown[]): unknown {
    return this.returnDays(value);
  }

  /**
   * 回傳日期的星期
   *
   * @static
   * @param {Date} date
   * @return {*}  {string}
   * @memberof CommonUtils
   */
  returnDays(date: Date): string {
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
}
