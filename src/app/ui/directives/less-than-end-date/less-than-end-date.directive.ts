import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  forwardRef,
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { Nullable } from 'primeng/ts-helpers';
import { MAX_DATE } from '../../../constant/constant';
import { greaterThanTodayValidator, lessThanEndDateValidator, lessThanTodayValidator } from '../../validators/validators';
import { ValidatorDirectiveBase } from '../validator-directive-base/validator-directive.base';


/**
 * 日期須小於迄日檢核 Directive
 *
 * @export
 * @class LessThanEndDateDirective
 * @extends {ValidatorDirectiveBase}
 * @implements {OnChanges}
 */
@Directive({
  selector:
    'p-date-picker[lessThanEndDate][formControlName],p-date-picker[lessThanEndDate][formControl],-date-picker[lessThanEndDate][ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LessThanEndDateDirective),
      multi: true,
    },
  ],
})
export class LessThanEndDateDirective
  extends ValidatorDirectiveBase
  implements OnChanges {
  @Input() lessThanEndDate: Nullable<Date> = null;

  @Input() endDateFieldName?: string;

  /**
   * 是否加入判斷須小於今日
   *
   * @memberof LessThanEndDateDirective
   */
  @Input() maxWithToday = false;

  /**
   * 是否加入判斷須大於今日
   *
   * @memberof LessThanEndDateDirective
   */
  @Input() minWithToday = false;

  override inputName = 'lessThanEndDate';

  //#region Angular lifecycle hoooks
  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }
  //#endregion Angular lifecycle hooks

  //#region ValidatorDirectiveBase implementation
  override createValidator(input: Date): ValidatorFn {
    // 大於今日與小於今日的檢核不可同時存在
    if (this.maxWithToday && this.minWithToday) {
      throw 'maxWithToday and minWithToday are exclusive!';
    }
    const todayValidatorFn = this.maxWithToday
      ? (ctrl: AbstractControl) => lessThanTodayValidator(ctrl)
      : (ctrl: AbstractControl) => greaterThanTodayValidator(ctrl);
    if (this.maxWithToday || this.minWithToday) {
      return (
        Validators.compose([
          todayValidatorFn,
          lessThanEndDateValidator(input, this.endDateFieldName),
        ]) ?? Validators.nullValidator
      );
    }
    return lessThanEndDateValidator(input, this.endDateFieldName);
  }

  override normalizeInput(input: Nullable<Date>): Date {
    return input ?? MAX_DATE;
  }
  //#endregion ValidatorDirectiveBase implementation
}
