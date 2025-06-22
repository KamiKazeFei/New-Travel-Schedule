import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularCommonModule } from '../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../module/primeng-ui/primeng-ui.module';
import { CommonService } from '../../../service/common.service';
import { CommonUtils } from '../../../ui/utils/common.utils';
import { DateUtils } from '../../../ui/utils/date.utils';
import { ScheduleInfoDialogComponent } from '../component/schedule-info-dialog/schedule-info-dialog.component';
import { TravelSchedule } from '../model/travel-schedule.model';

@Component({
  selector: 'app-schedule-list',
  imports: [
    PrimengUiModule,
    AngularCommonModule,
    ScheduleInfoDialogComponent
  ],
  templateUrl: './schedule-list.component.html',
  styleUrl: './schedule-list.component.scss',
  standalone: true
})
export class ScheduleListComponent {

  /**
   * 旅行計畫清單
   *
   * @type {TravelSchedule[]}
   * @memberof ScheduleListComponent
   */
  travelScheduleList: TravelSchedule[] = [];

  /**
   * 新增的旅行計畫
   *
   * @type {TravelSchedule}
   * @memberof ScheduleListComponent
   */
  newSchedule?: TravelSchedule;

  /**
   * 是否顯示行程資訊對話框
   *
   * @type {boolean}
   * @memberof ScheduleListComponent
   */
  isShowScheduleInfoDialog: boolean = false;

  /**
   * 建構子
   * @param {Router} _router
   * @memberof ScheduleListComponent
   */
  constructor(
    private _router: Router,
    private _commonService: CommonService
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
   * 元件初始化時執行
   *
   * @memberof ScheduleListComponent
   */
  ngOnInit(): void {
    this.travelScheduleList = this.cookieTravelScheduleList || [];
  }

  /**
   * 新增計畫
   *
   * @memberof ScheduleListComponent
   */
  create(): void {
    this.newSchedule = new TravelSchedule();
    this.newSchedule.startDate = CommonUtils.setDateDetailToZero(new Date());
    this.newSchedule.endDate = CommonUtils.setDateDetailToZero(DateUtils.addDays(new Date(), 5));
    this.isShowScheduleInfoDialog = true;
  }

  /**
   * 確認新增計畫
   *
   * @param {TravelSchedule} schedule
   * @memberof ScheduleListComponent
   */
  createConfirm(schedule: TravelSchedule): void {
    this._router.navigate(
      ['schedule/detail/' + schedule.id],
      {
        state: {
          data: {
            mode: 'create',
            schedule: schedule
          }
        }
      }
    );
    this.isShowScheduleInfoDialog = false;
  }

  /**
   * 取得行程資訊
   *
   * @param {string} id
   * @memberof ScheduleListComponent
   */
  getTravelSchedule(id: string): void {
    this._router.navigate(['schedule/detail/' + id]);
  }
}
