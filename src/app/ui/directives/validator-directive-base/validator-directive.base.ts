import { Directive, OnChanges, SimpleChanges } from '@angular/core';
import {
  Validator,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';

/**
 * 驗證類型的 Directive 基底類別(抽象)
 *
 * @export
 * @abstract
 * @class ValidatorDirectiveBase
 * @implements {Validator}
 * @implements {OnChanges}
 * @description
 * Copy from angular
 */
@Directive()
export abstract class ValidatorDirectiveBase implements Validator, OnChanges {
  private _validator: ValidatorFn = Validators.nullValidator;
  private _onChange!: () => void;

  /**
   * A flag that tracks whether this validator is enabled.
   *
   * Marking it `internal` (vs `protected`), so that this flag can be used in host bindings of
   * directive classes that extend this base class.
   * @internal
   */
  _enabled?: boolean;

  /**
   * Name of an input that matches directive selector attribute (e.g. `minlength` for
   * `MinLengthDirective`). An input with a given name might contain configuration information (like
   * `minlength='10'`) or a flag that indicates whether validator should be enabled (like
   * `[required]='false'`).
   *
   * @internal
   */
  abstract inputName: string;

  /**
   * Creates an instance of a validator (specific to a directive that extends this base class).
   *
   * @internal
   */
  abstract createValidator(input: unknown): ValidatorFn;

  /**
   * Performs the necessary input normalization based on a specific logic of a Directive.
   * For example, the function might be used to convert string-based representation of the
   * `minlength` input to an integer value that can later be used in the `Validators.minLength`
   * validator.
   *
   * @internal
   */
  abstract normalizeInput(input: unknown): unknown;

  /** @nodoc */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputName in changes) {
      const input = this.normalizeInput(changes[this.inputName].currentValue);
      this._enabled = this.enabled(input);
      this._validator = this._enabled
        ? this.createValidator(input)
        : Validators.nullValidator;
      if (this._onChange) {
        this._onChange();
      }
    }
  }

  /** @nodoc */
  validate(control: AbstractControl): ValidationErrors | null {
    return this._validator(control);
  }

  /** @nodoc */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  /**
   * @description
   * Determines whether this validator should be active or not based on an input.
   * Base class implementation checks whether an input is defined (if the value is different from
   * `null` and `undefined`). Validator classes that extend this base class can override this
   * function with the logic specific to a particular validator directive.
   */
  enabled(input: unknown): boolean {
    return input != null /* both `null` and `undefined` */;
  }
}
