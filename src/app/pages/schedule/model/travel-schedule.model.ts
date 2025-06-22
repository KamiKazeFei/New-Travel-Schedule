import 'uuid';
import { v4 } from 'uuid';

class BasicTable {
  /**
   * 主要識別碼
   *
   * @type {string}
   * @memberof BasicTable
   */
  id = v4();

  /**
   * 建立日期
   *
   * @type {Date}
   * @memberof BasicTable
   */
  createDate?: Date;
}


/** 行程計畫 */
export class TravelSchedule extends BasicTable {

  /**
   * 行程標題
   *
   * @type {string}
   * @memberof TravelSchedule
   */
  title?: string;

  /**
   * 行程開始日期
   *
   * @type {Date}
   * @memberof TravelSchedule
   */
  startDate?: Date;

  /**
   * 行程結束日期
   *
   * @type {Date}
   * @memberof TravelSchedule
   */
  endDate?: Date;

  /**
   * 行程描述
   *
   * @type {string}
   * @memberof TravelSchedule
   */
  description?: string;

  /**
   * 行程備註
   *
   * @type {string}
   * @memberof TravelSchedule
   */
  memo?: string;

  /**
   * 行程實際花費
   *
   * @type {number}
   * @memberof TravelSchedule
   */
  realCost?: number;

  /**
   * 行程天數
   *
   * @type {number}
   * @memberof TravelSchedule
   */
  passDay?: number;

  /**
   * 行程參與人員
   *
   * @type {TravelDayIntroduce[]}
   * @memberof TravelSchedule
   */
  dayIntroduces: TravelDayIntroduce[] = [];

  /**
   * 花費紀錄
   *
   * @type {TravelCostRecord[]}
   * @memberof TravelSchedule
   */
  costRecords: TravelCostRecord[] = [];

  /**
   * 選擇天數
   *
   * @type {TravelDayIntroduce}
   * @memberof TravelSchedule
   */
  selectedIntroduce?: TravelDayIntroduce;
}

/**
 * 花費紀錄
 *
 * @export
 * @interface TravelCostRecord
 * @extends {BasicTable}
 */
export class TravelCostRecord extends BasicTable {

  /**
   * 行程PK_ID
   *
   * @type {string}
   * @memberof TravelCostRecord
   */
  scheduleId?: string;

  /**
   * A機票、B住宿、C景點票券、D交通、E吃喝、F禮物、G其他
   *
   * @type {('A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G')}
   * @memberof TravelCostRecord
   */
  type?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

  /**
   * 序號
   *
   * @type {number}
   * @memberof TravelCostRecord
   */
  serNo?: number;

  /**
   * 說明
   *
   * @type {string}
   * @memberof TravelCostRecord
   */
  description?: string;

  /**
   * 花費金額
   *
   * @type {number}
   * @memberof TravelCostRecord
   */
  cost?: number
}

/**
 * 旅遊單天規劃
 *
 * @export
 * @interface TravelDayIntroduce
 * @extends {BasicTable}
 */
export class TravelDayIntroduce extends BasicTable {
  /**
   * 行程PK
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  scheduleId?: string;

  /**
   * 日期
   *
   * @type {Date}
   * @memberof TravelDayIntroduce
   */
  date?: Date;

  /**
   * 當日標題
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  title?: string;

  /**
   * 當日說明
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  description?: string;

  /**
   * 行程介紹
   *
   * @type {TravelDaySchedule[]}
   * @memberof TravelDayIntroduce
   */
  scheduleList?: TravelDaySchedule[];

  /**
   * 旅店名稱
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  hotelName?: string;

  /**
   * 旅店位置網址
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  hotelLocation?: string;

  /**
   * 購物清單
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  shoppingDetail?: string;

  /**
   * 備註清單
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  memo?: string

  /**
   * 早餐
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  breakfast?: string;

  /**
   * 早餐位置
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  breakfastLocation?: string;

  /**
   * 午餐
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  launch?: string;

  /**
   * 午餐位置
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  launchLocation?: string;

  /**
   * 晚餐
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  dinner?: string;

  /**
   * 晚餐位置
   *
   * @type {string}
   * @memberof TravelDayIntroduce
   */
  dinnerLocation?: string;
}

/** 單天行程 */
export class TravelDaySchedule extends BasicTable {
  /**
   * 序號
   *
   * @type {number}
   * @memberof TravelDaySchedule
   */
  serNo?: number;

  /**
   * 行程PK
   *
   * @type {string}
   * @memberof TravelDaySchedule
   */
  introduceId?: string;

  /**
   * 行程時間
   *
   * @type {string}
   * @memberof TravelDaySchedule
   */
  time?: string;

  /**
   * 行程說明
   *
   * @type {string}
   * @memberof TravelDaySchedule
   */
  description?: string;

  /**
   * 行程位置網址
   *
   * @type {string}
   * @memberof TravelDaySchedule
   */
  mapLocation?: string;
}
