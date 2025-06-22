import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { DateTime } from 'luxon';
import { CommonUtils } from '../utils/common.utils';

/**
 * 檢核器
 *
 * @export
 * @class ValidatorsEx
 * @extends {Validators}
 */
export class ValidatorsEx extends Validators {
  /**
   * 最小日期檢核
   *
   * @static
   * @param {Date} minDate
   * @return {*}  {ValidatorFn}
   * @memberof ValidatorsEx
   */
  static minDate(minDate: Date): ValidatorFn {
    return minDateValidator(minDate);
  }

  /**
   * 最大日期檢核
   *
   * @static
   * @param {Date} maxDate
   * @return {*}  {ValidatorFn}
   * @memberof ValidatorsEx
   */
  static maxDate(maxDate: Date): ValidatorFn {
    return maxDateValidator(maxDate);
  }

  /**
   * 須小於迄日檢核
   *
   * @static
   * @param {Date} endDate
   * @return {*}  {ValidatorFn}
   * @memberof ValidatorsEx
   */
  static lessThanEndDate(endDate: Date, targetFieldName?: string): ValidatorFn {
    return lessThanEndDateValidator(endDate, targetFieldName);
  }

  /**
   * 須大於起日檢核
   *
   * @static
   * @param {Date} startDate
   * @return {*}  {ValidatorFn}
   * @memberof ValidatorsEx
   */
  static greaterThanStartDate(
    startDate: Date,
    targetFieldName?: string
  ): ValidatorFn {
    return greaterThanStartDateValidator(startDate, targetFieldName);
  }

  /**
   * 須小於今日檢核
   *
   * @static
   * @param {AbstractControl} ctrl
   * @returns
   */
  static lessThanToday(ctrl: AbstractControl): ValidationErrors | null {
    return lessThanTodayValidator(ctrl);
  }

  /**
   * 須大於今日檢核
   * @static
   * @param {AbstractControl} ctrl
   * @returns
   */
  static greaterThanToday(ctrl: AbstractControl): ValidationErrors | null {
    return greaterThanTodayValidator(ctrl);
  }

  /**
   * 須小於特定數值
   *
   * @static
   * @param {AbstractControl} maxNumberCtrl
   * @return {*}  {ValidatorFn}
   * @memberof ValidatorsEx
   */
  static lessThanMaxNumber(maxNumberCtrl: AbstractControl): ValidatorFn {
    return lessThanMaxNumberValidator(maxNumberCtrl);
  }

  /**
   * 須大於特定數值
   *
   * @static
   * @param {AbstractControl} minNumberCtrl
   * @return {*}  {ValidatorFn}
   * @memberof ValidatorsEx
   */
  static greaterThanMinNumber(minNumberCtrl: AbstractControl): ValidatorFn {
    return greaterThanMinNumberValidator(minNumberCtrl);
  }
}

/**
 * 最小日期檢核
 *
 * @export
 * @param {Date} minDate
 * @return {*}  {ValidatorFn}
 */
export function minDateValidator(minDate: Date): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!ctrl.value) {
      return null;
    }
    const valueDate = DateTime.fromJSDate(ctrl.value);
    const targetDate = DateTime.fromJSDate(minDate);

    return valueDate < targetDate
      ? { minDate: { min: minDate, actual: valueDate.toJSDate() } }
      : null;
  };
}

/**
 * 最大日期檢核
 *
 * @export
 * @param {Date} maxDate
 * @return {*}  {ValidatorFn}
 */
export function maxDateValidator(maxDate: Date): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!ctrl.value) {
      return null;
    }
    const valueDate = DateTime.fromJSDate(ctrl.value);
    const targetDate = DateTime.fromJSDate(maxDate);

    return valueDate > targetDate
      ? { maxDate: { max: maxDate, actual: valueDate.toJSDate() } }
      : null;
  };
}

/**
 * 須小於迄日檢核
 *
 * @export
 * @param {Date} endDate
 * @return {*}  {ValidatorFn}
 */
export function lessThanEndDateValidator(
  endDate: Date,
  targetFieldName?: string
): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!ctrl.value) {
      return null;
    }
    const result = maxDateValidator(endDate)(ctrl);
    if (!result) {
      return null;
    }
    return {
      lessThanEndDate: { endDate, actual: result['actual'], targetFieldName },
    };
  };
}

/**
 * 須大於起日檢核
 *
 * @export
 * @param {Date} startDate
 * @return {*}  {ValidatorFn}
 */
export function greaterThanStartDateValidator(
  startDate: Date,
  targetFieldName?: string
): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!ctrl.value) {
      return null;
    }
    const result = minDateValidator(startDate)(ctrl);
    if (!result) {
      return null;
    }
    return {
      greaterThanStartDate: {
        startDate,
        actual: result['actual'],
        targetFieldName,
      },
    };
  };
}

/**
 * 須小於今日檢核
 *
 * @export
 * @param {AbstractControl} ctrl
 * @return {*}  {(ValidationErrors | null)}
 */
export function lessThanTodayValidator(
  ctrl: AbstractControl
): ValidationErrors | null {
  if (!ctrl.value) {
    return null;
  }
  const today = DateTime.now().startOf('day').toJSDate();
  const result = maxDateValidator(today)(ctrl);
  if (!result) {
    return null;
  }
  return { lessThanToday: { today, actual: result['actual'] } };
}

/**
 * 須大於今日檢核
 *
 * @export
 * @param {AbstractControl} ctrl
 * @return {*}  {(ValidationErrors | null)}
 */
export function greaterThanTodayValidator(
  ctrl: AbstractControl
): ValidationErrors | null {
  const today = DateTime.now().startOf('day').toJSDate();
  const result = minDateValidator(today)(ctrl);
  if (!result) {
    return null;
  }
  return { greaterThanToday: { today, actual: result['actual'] } };
}

/**
 * 須小於特定輸入項
 *
 * @export
 * @param {AbstractControl} targetCtrl
 * @return {*}  {ValidatorFn}
 */
export function lessThanMaxNumberValidator(
  maxNumberCtrl: AbstractControl
): ValidatorFn {
  return (targetCtrl: AbstractControl): ValidationErrors | null => {
    if (!targetCtrl.value) {
      return null;
    }
    if (!maxNumberCtrl.value) {
      return null;
    }
    const result = maxNumberValidator(maxNumberCtrl.value)(targetCtrl);
    if (!result) {
      return null;
    }
    return {
      lessThanMaxNumber: {
        maxNumber: maxNumberCtrl.value,
        actual: result['actual'],
      },
    };
  };
}

/**
 * 須大於特定輸入項
 *
 * @export
 * @param {AbstractControl} minNumberCtrl
 * @return {*}  {ValidatorFn}
 */
export function greaterThanMinNumberValidator(
  minNumberCtrl: AbstractControl
): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!ctrl.value) {
      return null;
    }
    if (!minNumberCtrl.value) {
      return null;
    }
    const result = minNumberValidator(minNumberCtrl.value)(ctrl);
    if (!result) {
      return null;
    }
    return {
      greaterThanMinNumber: {
        minNumber: minNumberCtrl.value,
        actual: result['actual'],
      },
    };
  };
}

/**
 * 最小數值檢核
 *
 * @export
 * @param {number} minNumber
 * @return {*}  {ValidatorFn}
 */
export function minNumberValidator(
  minNumber: number | null | undefined
): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!minNumber) {
      return null;
    }

    if (CommonUtils.isNullOrUndefined(ctrl.value)) {
      return null;
    }

    const valueNumber = Number(ctrl.value);

    return valueNumber < minNumber
      ? { minNumber: { minNumber: minNumber, actual: valueNumber } }
      : null;
  };
}

/**
 * 最大數值檢核
 *
 * @export
 * @param {number} maxNumber
 * @return {*}  {ValidatorFn}
 */
export function maxNumberValidator(
  maxNumber: number | null | undefined
): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    if (!maxNumber) {
      return null;
    }

    if (CommonUtils.isNullOrUndefined(ctrl.value)) {
      return null;
    }

    const valueNumber = Number(ctrl.value);

    return valueNumber > maxNumber
      ? { maxNumber: { maxNumber: maxNumber, actual: valueNumber } }
      : null;
  };
}

