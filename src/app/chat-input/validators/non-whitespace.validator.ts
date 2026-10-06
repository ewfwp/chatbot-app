import type { FieldValidator } from '@angular/forms/signals';

export const nonWhitespaceValidator: FieldValidator<string> = ({ value }) =>
  value().trim().length > 0 ? undefined : { kind: 'whitespace' };
