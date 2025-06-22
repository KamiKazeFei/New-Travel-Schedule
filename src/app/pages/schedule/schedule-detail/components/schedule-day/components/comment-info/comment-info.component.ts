import { Component, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AngularCommonModule } from '../../../../../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../../../../../module/primeng-ui/primeng-ui.module';
import { TravelSchedule } from '../../../../../model/travel-schedule.model';

@Component({
  selector: 'app-comment-info',
  imports: [
    AngularCommonModule,
    PrimengUiModule,
  ],
  templateUrl: './comment-info.component.html',
  styleUrl: './comment-info.component.scss'
})
export class CommentInfoComponent {

  /**
   * 行程資料
   *
   * @type {TravelSchedule}
   * @memberof CommentInfoComponent
   */
  @Input() schedule: TravelSchedule;

  /**
   * 建構子
   * @memberof CommentInfoComponent
   */
  constructor(
    private _confirmationService: ConfirmationService
  ) { }


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
}
