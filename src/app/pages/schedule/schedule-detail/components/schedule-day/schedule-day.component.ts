import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AngularCommonModule } from '../../../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../../../module/primeng-ui/primeng-ui.module';
import { TravelSchedule } from '../../../model/travel-schedule.model';
import { CommentInfoComponent } from './components/comment-info/comment-info.component';

@Component({
  selector: 'app-schedule-day',
  imports: [
    AngularCommonModule,
    PrimengUiModule,
    CommentInfoComponent,
  ],
  templateUrl: './schedule-day.component.html',
  styleUrl: './schedule-day.component.scss'
})
export class ScheduleDayComponent {

  /**
   * 行程資料
   *
   * @type {TravelSchedule}
   * @memberof ScheduleDayComponent
   */
  @Input() schedule: TravelSchedule;

  /**
   * 建構子
   * @memberof ScheduleDayComponent
   */
  constructor(
    private _confirmationService: ConfirmationService
  ) { }

  /**
   * 移除單一天內的指定行程
   *
   * @param {number} index
   * @memberof ScheduleDetailComponent
   */
  deleteDaysSchedule(index: number): void {
    this.schedule.selectedIntroduce.scheduleList = this.schedule.selectedIntroduce.scheduleList.filter((ele, i) => i !== index);
    this.schedule.selectedIntroduce.scheduleList.forEach((ele, i) => ele.serNo = (i + 1));
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
   * 移動行程安排順序
   *
   * @param {CdkDragDrop<any[]>} event
   * @memberof ScheduleDetailComponent
   */
  changeScheduleOrder(event: any) {
    moveItemInArray(this.schedule.selectedIntroduce.scheduleList, event.previousIndex, event.currentIndex);
    this.schedule.selectedIntroduce.scheduleList.forEach((ele, i) => ele.serNo = (i + 1));
  }

}
