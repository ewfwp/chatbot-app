import { ValidationErrors, ValidatorFn } from '@angular/forms';

export const nonWhitespaceValidator: ValidatorFn = (control): ValidationErrors | null => {
  return typeof control.value === 'string' && control.value.trim().length > 0
    ? null
    : { whitespace: true };
};
