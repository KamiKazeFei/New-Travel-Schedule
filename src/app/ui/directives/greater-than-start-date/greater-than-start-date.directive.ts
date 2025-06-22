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
import { greaterThanStartDateValidator, greaterThanTodayValidator, lessThanTodayValidator } from '../../validators/validators';
import { ValidatorDirectiveBase } from '../validator-directive-base/validator-directive.base';
import { MIN_DATE } from '../../../constant/constant';

/**
 * 日期須大於起日檢核 Directive
 *
 * @export
 * @class GreaterThanStartDateDirective
 * @extends {ValidatorDirectiveBase}
 * @implements {OnChanges}
 */
@Directive({
  selector:
    'p-date-picker[greaterThanStartDate][formControlName],p-date-picker[greaterThanStartDate][formControl],p-date-picker[greaterThanStartDate][ngModel]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GreaterThanStartDateDirective),
      multi: true,
    },
  ],
})
export class GreaterThanStartDateDirective
  extends ValidatorDirectiveBase
  implements OnChanges {
  @Input() greaterThanStartDate: Nullable<Date> = null;

  @Input() startDateFieldName?: string;

  /**
   * 是否加入判斷須小於今日
   *
   * @memberof GreaterThanStartDateDirective
   */
  @Input() maxWithToday = false;

  /**
   * 是否加入判斷須大於今日
   *
   * @memberof GreaterThanStartDateDirective
   */
  @Input() minWithToday = false;
  override inputName = 'greaterThanStartDate';

  //#region Angular lifecycle hooks
  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
  }
  //#endregion Angular lifecycle hooks

  //#region ValidatorDirectiveBase implementation
  override createValidator(input: Date): ValidatorFn {
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
          greaterThanStartDateValidator(input, this.startDateFieldName),
        ]) ?? Validators.nullValidator
      );
    }
    return greaterThanStartDateValidator(input, this.startDateFieldName);
  }

  override normalizeInput(input: Nullable<Date>): Date {
    return input ?? MIN_DATE;
  }
  //#endregion ValidatorDirectiveBase implementation
}
