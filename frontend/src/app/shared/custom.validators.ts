import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function textValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const isText = isNaN(control.value);
    const isNotText = !isText;
    return isNotText ? { notText: true }: null ;
  }
}