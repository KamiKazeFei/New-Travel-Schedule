import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { TravelSchedule } from '../pages/schedule/model/travel-schedule.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor() { }

  /**
   * 顯示Block
   *
   * @type {Subject<boolean>}
   * @memberof CommonService
   */
  blockEmitter: Subject<boolean> = new Subject<boolean>();

  /**
   * 顯示訊息
   *
   * @type {Subject<Object>}
   * @memberof CommonService
   */
  msgEmitter: Subject<Object> = new Subject<Object>();

  /**
   * 旅行計畫列表
   *
   * @readonly
   * @type {TravelSchedule[]}
   * @memberof ScheduleDetailComponent
   */
  get cookieTravelScheduleList(): Array<TravelSchedule> {
    const listData = document?.cookie?.split("; ")?.find((row) => row?.startsWith("scheduleList="))?.split("=")?.[1] as string;
    return listData ? JSON.parse(listData) : [];
  }

  /**
   * 設定遮罩
   *
   * @param {boolean} action
   * @memberof CommonService
   */
  setBlock(action: boolean): void {
    this.blockEmitter.next(action)
  }

  /**
   * 顯示訊息
   *
   * @param {string} mode
   * @param {string} msg
   * @memberof CommonService
   */
  showMsg(mode: string, msg: string): void {
    const obj = {
      detail: msg,
      severity: '',
    };
    switch (mode) {
      case 's':
        obj.severity = 'success';
        break;
      case 'i':
        obj.severity = 'info';
        break;
      case 'w':
        obj.severity = 'warn';
        break;
      case 'e':
        obj.severity = 'error';
        break;
    }
    this.msgEmitter.next(obj);
  }

  /**
   * 設定Cookies
   *
   * @param {string} cookieName
   * @param {string} cookieValue
   * @param {number} [expirationDays=14]
   * @memberof CommonService
   */
  setCookie(cookieName: string, cookieValue: string): void {
    this.clearAllCookie();
    const cookieString = cookieName + "=" + cookieValue + ";";
    document.cookie = cookieString;
  }

  /**
   * 請除所有Cookies
   *
   * @memberof CommonService
   */
  clearAllCookie(): void {
    const date = new Date();
    date.setTime(date.getTime() - 10000);
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
      for (var i = keys.length; i--;)
        document.cookie = keys[i] + "=0; expire=" + date.toUTCString() + "; path=/";
    }
  }

  /**
   * 是否為行動裝置
   *
   * @return {*}  {boolean}
   * @memberof CommonService
   */
  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}
