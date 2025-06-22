import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularCommonModule } from '../../../../module/angular-common/angular-common.module';
import { PrimengUiModule } from '../../../../module/primeng-ui/primeng-ui.module';
import { CommonService } from '../../../../service/common.service';
import { GreaterThanStartDateDirective } from '../../../../ui/directives/greater-than-start-date/greater-than-start-date.directive';
import { LessThanEndDateDirective } from '../../../../ui/directives/less-than-end-date/less-than-end-date.directive';
import { DateUtils } from '../../../../ui/utils/date.utils';
import { TravelSchedule } from '../../model/travel-schedule.model';

@Component({
  selector: 'app-schedule-info-dialog',
  imports: [
    PrimengUiModule,
    AngularCommonModule,
    GreaterThanStartDateDirective,
    LessThanEndDateDirective
  ],
  templateUrl: './schedule-info-dialog.component.html',
  styleUrl: './schedule-info-dialog.component.scss',
  providers: [
    CommonService
  ],
  standalone: true
})
export class ScheduleInfoDialogComponent {

  /**
   * 是否顯示對話框
   *
   * @type {boolean}
   * @memberof ScheduleInfoDialogComponent
   */
  @Input() visible: boolean = false;

  /**
   * 編輯行程
   *
   * @type {TravelSchedule}
   * @memberof ScheduleInfoDialogComponent
   */
  @Input() selectedSchedule?: TravelSchedule;

  /**
   * 顯示狀態變更
   *
   * @type {EventEmitter<boolean>}
   * @memberof ScheduleInfoDialogComponent
   */
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * 確認行程資訊
   *
   * @type {EventEmitter<TravelSchedule>}
   * @memberof ScheduleInfoDialogComponent
   */
  @Output() confirmEmitter: EventEmitter<TravelSchedule> = new EventEmitter<TravelSchedule>();

  /**
   * 建立表單
   *
   * @type {Form}
   * @memberof ScheduleInfoDialogComponent
   */
  form: FormGroup;

  /**
   * 建構子
   * @memberof ScheduleInfoDialogComponent
   */
  constructor(private _fb: FormBuilder) {
    this.form = this._buildForm();
  }

  /**
   * 輸入異動
   *
   * @param {SimpleChanges} changes
   * @memberof ScheduleInfoDialogComponent
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSchedule']) {
      this.form.patchValue(changes['selectedSchedule'].currentValue);
    }
  }

  /**
   * 建立表單
   *
   * @private
   * @memberof ScheduleInfoDialogComponent
   */
  private _buildForm(): FormGroup {
    const form = this._fb.group({
      id: new FormControl(undefined),
      title: new FormControl(undefined, [Validators.required]),
      description: new FormControl(undefined),
      startDate: new FormControl(new Date(), [Validators.required]),
      endDate: new FormControl(DateUtils.addDays(new Date(), 5), [Validators.required])
    });
    return form;
  }

  /**
   * 取消
   *
   * @memberof ScheduleInfoDialogComponent
   */
  confirm(): void {
    const passDay = Math.floor((this.form.controls['endDate'].getRawValue().getTime() - this.form.controls['startDate'].getRawValue().getTime()) / 1000 / 60 / 60 / 24);
    this.confirmEmitter.emit({
      ...this.form.getRawValue(),
      passDay
    });
  }

  /**
   * 取消
   *
   * @memberof ScheduleInfoDialogComponent
   */
  cancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
