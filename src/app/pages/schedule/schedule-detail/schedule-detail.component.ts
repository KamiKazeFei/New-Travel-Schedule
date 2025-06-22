import { DatePipe, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { COST_TYPE_OPTIONS } from '../../../constant/constant';
import { AngularCommonModule } from '../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../module/primeng-ui/primeng-ui.module';
import { CommonService } from '../../../service/common.service';
import { ScheduleInfoDialogComponent } from '../component/schedule-info-dialog/schedule-info-dialog.component';
import { TravelCostRecord, TravelDayIntroduce, TravelDaySchedule, TravelSchedule } from '../model/travel-schedule.model';
import { CostRecordComponent } from './components/cost-record/cost-record.component';
import { PdfExportDialogComponent } from './components/pdf-export-dialog/pdf-export-dialog.component';
import { ScheduleDayComponent } from './components/schedule-day/schedule-day.component';
import { WeekDateStringPipe } from './pipe/week-date-string.pipe';

@Component({
  selector: 'app-schedule-detail',
  imports: [
    AngularCommonModule,
    PrimengUiModule,
    WeekDateStringPipe,
    ScheduleInfoDialogComponent,
    ScheduleDayComponent,
    CostRecordComponent,
    PdfExportDialogComponent
  ],
  templateUrl: './schedule-detail.component.html',
  styleUrl: './schedule-detail.component.scss',
  providers: [
    DatePipe,
    DecimalPipe,
  ]
})
export class ScheduleDetailComponent {

  /**
   * 現在時間
   *
   * @memberof ScheduleDetailComponent
   */
  now = new Date();

  /**
   * 編輯行程基本資訊視窗
   *
   * @memberof ScheduleDetailComponent
   */
  scheduleEditDialog = false;

  /**
   * 選取行程
   *
   * @type {TravelSchedule}
   * @memberof ScheduleDetailComponent
   */
  schedule?: TravelSchedule;

  /**
   * 原選取行程
   *
   * @type {TravelSchedule}
   * @memberof ScheduleDetailComponent
   */
  oriSchedule?: TravelSchedule;

  /**
   * 已選取行程
   *
   * @type {TravelSchedule}
   * @memberof ScheduleDetailComponent
   */
  selectedSchedule?: TravelSchedule;

  /**
   * 設定基本資訊
   *
   * @memberof ScheduleDetailComponent
   */
  basicInfoSettingDialog = false;

  /**
   * 檢視分析圖表
   *
   * @memberof ScheduleDetailComponent
   */
  costAnanalysisDialog = false;

  /**
   * 圖表載入狀態
   *
   * @memberof ScheduleDetailComponent
   */
  chartLoading = false;

  /**
   * PDF載入狀態
   *
   * @memberof ScheduleDetailComponent
   */
  pdfLoading = false;

  /**
   * 儲存狀態
   *
   * @memberof ScheduleDetailComponent
   */
  saveLoading = false;

  /**
   * 顯示模式
   *
   * @type {string}
   * @memberof ScheduleDetailComponent
   */
  mode?: string;

  /**
   * 編輯模式
   *
   * @memberof ScheduleDetailComponent
   */
  modeOptions = [
    { label: '行程安排', value: 'schedule' },
    { label: '預算紀錄表', value: 'costRecord' }
  ];

  /**
   * 花費類型陣列
   *
   * @memberof ScheduleDetailComponent
   */
  costTypeOptions = COST_TYPE_OPTIONS;

  /**
   * 花費排序
   *
   * @type {string}
   * @memberof ScheduleDetailComponent
   */
  costRecordSortMode?: string;

  /**
   * 排序紀錄
   *
   * @memberof ScheduleDetailComponent
   */
  costRecordSortMap = {};

  /**
   * 設定輸出pdf設定 *
   *
   * @memberof ScheduleDetailComponent
   */
  exportPdfSettingDialog = false;

  /**
   * 建構子
   * @param {Router} router
   * @param {CommonService} commonService
   * @param {ConfirmationService} _confirmationService
   * @param {DecimalPipe} _decimalPipe
   * @param {DatePipe} _datePipe
   * @memberof ScheduleDetailComponent
   */
  constructor(
    private _router: ActivatedRoute,
    private _navigationRouter: Router,
    private _datePipe: DatePipe,
    private _decimalPipe: DecimalPipe,
    private _commonService: CommonService,
    private _confirmationService: ConfirmationService,
  ) { }

  /**
   * 取得旅行計畫列表
   *
   * @readonly
   * @type {Array<TravelSchedule>}
   * @memberof ScheduleDetailComponent
   */
  get cookieTravelScheduleList(): Array<TravelSchedule> {
    return this._commonService.cookieTravelScheduleList;
  }

  /**
   * 初始化
   *
   * @return {*}  {Promise<void>}
   * @memberof ScheduleDetailComponent
   */
  async ngOnInit(): Promise<void> {
    const id = this._router.snapshot.params['id'];
    const state = history.state?.data ?? {};
    const isCreateMode = state['mode'] === 'create';

    if (isCreateMode) {
      const stateData: TravelSchedule = {
        ...state['schedule'],
        costRecords: [],
      };
      this._restoreDayIntroduce(stateData, stateData.passDay);
      this.schedule = stateData as TravelSchedule;
      this.oriSchedule = JSON.parse(JSON.stringify(stateData));
      this.schedule.selectedIntroduce = this.schedule.dayIntroduces[0];
      this.mode = 'schedule';
    } else {
      !!id
        ? this.getTravelScheduleData(id)
        : this._navigationRouter.navigate(['schedule']);
    }
  }

  /**
   * 查詢旅行計畫
   *
   * @param {string} id
   * @return {*}  {Promise<void>}
   * @memberof ScheduleDetailComponent
   */
  async getTravelScheduleData(id: string): Promise<void> {
    const cookieValue: TravelSchedule[] = JSON.parse(document.cookie.split("; ").find((row) => row.startsWith("scheduleList="))?.split("=")[1] as string);
    const schedule: TravelSchedule = cookieValue.find(ele => ele.id === id) as TravelSchedule;
    Object.keys(schedule).forEach(key => {
      if (schedule?.[key] && key.includes('Date')) {
        schedule[key] = new Date(schedule[key]);
      }
    });
    schedule.selectedIntroduce = schedule.dayIntroduces[0];
    schedule.dayIntroduces.forEach(ele => {
      ele.date = new Date(ele.date);
    })
    this.schedule = JSON.parse(JSON.stringify(schedule));
    this.oriSchedule = JSON.parse(JSON.stringify(schedule));
    if (!this.mode) {
      this.mode = this.modeOptions[0].value;
    }
  }

  /**
   * 儲存旅行計畫
   *
   * @param {TravelSchedule} schedule
   * @memberof ScheduleDetailComponent
   */
  saveTravelScheduleData(): void {
    if (this.cookieTravelScheduleList.find(ele => ele.id === this.schedule.id)) {
      this.cookieTravelScheduleList[this.cookieTravelScheduleList.map(ele => ele.id).indexOf(this.schedule.id)] = { ...this.schedule };
    } else {
      this.cookieTravelScheduleList.push({ ...this.schedule })
    }
    this.schedule.selectedIntroduce = this.schedule.dayIntroduces[0];

    // 複製原檔
    this.oriSchedule = JSON.parse(JSON.stringify(this.schedule));
    this.oriSchedule.startDate = new Date(this.oriSchedule.startDate)
    this.oriSchedule.endDate = new Date(this.oriSchedule.endDate)
    this.oriSchedule.costRecords = this.oriSchedule.costRecords.map(ele => ({ ...ele }))
    this.oriSchedule.dayIntroduces = this.oriSchedule.dayIntroduces.map(ele => {
      const obj = Object.assign({}, ele);
      obj.scheduleList = obj.scheduleList.map(val => ({ ...val }));
      return obj
    })

    this._commonService.setCookie('scheduleList', JSON.stringify(this.cookieTravelScheduleList));
    this._commonService.showMsg('s', '儲存成功');
  }

  /**
   * 移除行程
   *
   * @param {TravelSchedule} schedule
   * @memberof ScheduleDetailComponent
   */
  deleteSchedule(schedule: TravelSchedule): void {
    this._confirmationService.confirm({
      header: '【刪除】確認',
      message: '您確定要刪除【' + schedule.title + '】行程計畫?',
      accept: async () => {
        const travelSchedule = this.cookieTravelScheduleList;
        this._commonService.setCookie('scheduleList', JSON.stringify(travelSchedule.filter(ele => ele.id !== schedule.id)));
      }
    })
  }

  /**
   * 編輯基本資訊
   *
   * @memberof ScheduleDetailComponent
   */
  openEditBasicInfo(): void {
    this.selectedSchedule = { ...this.schedule };
    this.basicInfoSettingDialog = true;
  }

  /**
   * 編輯基本資訊
   *
   * @param {TravelSchedule} schedule
   * @memberof ScheduleDetailComponent
   */
  onBasicInfoUpdate(schedule: TravelSchedule): void {
    if ((JSON.stringify(schedule) !== JSON.stringify(this.selectedSchedule))) {
      this._confirmationService.confirm({
        header: '確認',
        message: '未超出天數的資料將被保存並更改日期，超出旅程天數的資料將直接移除，確定要更新行程日期，',
        accept: () => {
          this.basicInfoSettingDialog = false;
          this.schedule = {
            ...this.selectedSchedule,
            startDate: new Date(schedule.startDate),
            endDate: new Date(schedule.endDate),
            title: schedule.title,
            description: schedule.description,
            passDay: schedule.passDay,
          }
          this.selectedSchedule.passDay = Math.floor((this.selectedSchedule.endDate.getTime() - this.selectedSchedule.startDate.getTime()) / 1000 / 60 / 60 / 24);
          this.schedule.dayIntroduces = this.schedule.dayIntroduces.filter((ele, i) => {
            return ele.date.getTime() >= schedule.startDate.getTime() && ele.date.getTime() <= schedule.endDate.getTime();
          });
          this._restoreDayIntroduce(this.schedule, this.schedule.passDay);
          this.schedule.selectedIntroduce = this.schedule.dayIntroduces[0];
        }
      })
    }
  }

  /**
   * 建立、補全旅遊天數資訊
   *
   * @private
   * @memberof ScheduleDetailComponent
   */
  private _restoreDayIntroduce(schedule: TravelSchedule, passDay: number): void {
    if (!schedule.dayIntroduces) {
      schedule.dayIntroduces = [];
    }
    for (let i = 0; i <= passDay; i++) {
      const date = new Date(schedule.startDate.getFullYear(), schedule.startDate.getMonth(), schedule.startDate.getDate() + i);
      if (schedule.dayIntroduces[i]) {
        schedule.dayIntroduces[i].date = date;
      } else {
        const dayIntroduce = new TravelDayIntroduce();
        dayIntroduce.scheduleId = schedule.id;
        dayIntroduce.date = date;
        schedule.dayIntroduces.push(dayIntroduce);
      }
    }
  }

  /**
   * 確認儲存
   *
   * @param {string} [mode]
   * @memberof ScheduleDetailComponent
   */
  confirmCancel(mode?: string) {
    const tempOriSchedule: TravelSchedule = JSON.parse(JSON.stringify(this.oriSchedule));
    const tempSchedule = JSON.parse(JSON.stringify(this.schedule));
    delete tempSchedule.selectedIntroduce;
    delete tempOriSchedule.selectedIntroduce;

    switch (mode) {
      case 'basicInfo':
        if (!this.oriSchedule) {
          this.oriSchedule = {} as any
        }
        if ((JSON.stringify(tempSchedule) !== JSON.stringify(tempOriSchedule))) {
          this._confirmationService.confirm({
            header: '確認',
            message: '確定不儲存已更動資訊就離開?',
            accept: () => {
              this.basicInfoSettingDialog = false;
              this.selectedSchedule = null;
            }
          })
        } else {
          this.basicInfoSettingDialog = false;
          this.selectedSchedule = null;
        }
        break;
      default:
        if (JSON.stringify(tempSchedule) !== JSON.stringify(tempOriSchedule)) {
          this._confirmationService.confirm({
            header: '確認',
            message: '尚有資料尚未儲存，確定要離開編輯介面?',
            accept: () => {
              this.cancel();
            }
          })
        } else {
          this.cancel()
        }
        break;
    }
  }

  /**
   * 增加新旅遊天
   *
   * @memberof ScheduleDetailComponent
   */
  addNewScheduleDay(): void {
    const dayIntroduce = new TravelDayIntroduce()
    const endDate = this.schedule.dayIntroduces.slice(-1)[0].date;
    dayIntroduce.id = this.schedule.id;
    dayIntroduce.date = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);
    this.schedule.dayIntroduces.push(dayIntroduce);
    this.schedule.endDate = new Date(dayIntroduce.date)
    this.schedule.passDay++;
  }

  /**
   * 建立新行程
   *
   * @memberof ScheduleDetailComponent
   */
  createDayIntroduce(): void {
    const scheduleIntroduce = new TravelDaySchedule();
    scheduleIntroduce.id = this.schedule.selectedIntroduce.id;
    if (!this.schedule.selectedIntroduce.scheduleList) {
      this.schedule.selectedIntroduce.scheduleList = [];
    }
    this.schedule.selectedIntroduce.scheduleList.push(scheduleIntroduce)
    this.schedule.selectedIntroduce.scheduleList.forEach((ele, i) => ele.serNo = (i + 1));
    setTimeout(() => {
      const element = document.getElementById('dayPerScheduleList');
      if (element) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 100)
  }

  /**
   * 建立預算紀錄
   *
   * @memberof ScheduleDetailComponent
   */
  createCostRecord(): void {
    const costRecord = new TravelCostRecord();
    costRecord.id = this.schedule.id;
    if (!this.schedule.costRecords) {
      this.schedule.costRecords = []
    }
    // 行動裝置的話往下加，反之從頭插入
    this._commonService.isMobileDevice()
      ? this.schedule.costRecords.push(costRecord)
      : this.schedule.costRecords.splice(0, 0, costRecord)
    this.schedule.costRecords.forEach((ele, i) => ele.serNo = (i + 1));
  }

  /**
   * 移除預算紀錄
   *
   * @param {TravelCostRecord} data
   * @memberof ScheduleDetailComponent
   */
  deleteCostRecord(data: TravelCostRecord): void {
    this.schedule.costRecords = this.schedule.costRecords.filter(ele => ele.id !== data.id)
    this.schedule.realCost = this.schedule.costRecords.reduce((acc, ele) => acc + ele.cost, 0);
  }

  /**
   * 計算花費成本
   *
   * @param {TravelCostRecord} record
   * @memberof ScheduleDetailComponent
   */
  calculateCost(): void {
    this.schedule.realCost = this.schedule.costRecords.reduce((acc, ele) => acc + ele.cost, 0);
  }

  /**
   * 儲存
   *
   * @return {*}  {Promise<void>}
   * @memberof ScheduleDetailComponent
   */
  async save(): Promise<void> {
    const cookieTravelScheduleList = this.cookieTravelScheduleList;
    if (cookieTravelScheduleList.find(ele => ele.id === this.schedule.id)) {
      cookieTravelScheduleList[cookieTravelScheduleList.map(ele => ele.id).indexOf(this.schedule.id)] = { ...this.schedule };
    } else {
      cookieTravelScheduleList.push({ ...this.schedule })
    }
    this._commonService.setCookie('scheduleList', JSON.stringify(cookieTravelScheduleList));
    this._commonService.showMsg('s', '儲存成功');
    this._navigationRouter.navigate(['schedule/' + this.schedule.id]);
  }

  /**
   * 取消
   *
   * @return {*}  {Promise<void>}
   * @memberof ScheduleDetailComponent
   */
  async cancel(): Promise<void> {
    this.basicInfoSettingDialog = false;
    this.schedule = null;
    this.oriSchedule = null;
    this.mode = null;
    this._navigationRouter.navigate(['schedule']);
  }

  /**
   * 前往網址
   *
   * @param {string} url
   * @memberof ScheduleDetailComponent
   */
  gotoUrl(url: string): void {
    if (url) {
      this._confirmationService.confirm({
        header: '確認',
        message: '是否確認要前往此網址：\n' + url,
        accept: () => {
          window.open(url, '_blank');
        }
      })
    }
  }

  /**
   * 進行預算紀錄表排序
   *
   * @param {string} column
   * @memberof ScheduleDetailComponent
   */
  sortCostRecordsData(column: string): void {
    this.costRecordSortMap[column] = !this.costRecordSortMap[column];
    this.schedule.costRecords.sort((a, b) => this.costRecordSortMap[column] ? a[column].localeCompare(b[column]) : b[column].localeCompare(a[column]))
    this.schedule.costRecords.forEach((ele, i) => ele.serNo = i + 1);
  }

  /**
   * 檢查排序鍵值是否已經在Map中
   *
   * @param {string} columnName
   * @return {*}  {boolean}
   * @memberof ScheduleDetailComponent
   */
  checkSortKeyInMap(columnName: string): boolean {
    return Object.keys(this.costRecordSortMap).includes(columnName)
  }

  /**
   * 設定輸出pdf設定
   *
   * @param {boolean} action
   * @memberof ScheduleDetailComponent
   */
  openExportPdfSettingDialog(): void {
    this.exportPdfSettingDialog = true;
  }

  /**
   * 切換目前選取單檔
   *
   * @param {TravelDayIntroduce} data
   * @memberof ScheduleDetailComponent
   */
  switchSelectedData(data: TravelDayIntroduce): void {
    this.schedule.selectedIntroduce = data;
  }
}



