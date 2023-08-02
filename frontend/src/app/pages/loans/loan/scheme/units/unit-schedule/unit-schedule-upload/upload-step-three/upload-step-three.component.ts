import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

interface ControlValidationMessages {
  [controlName: string]: {
    [errorType: string]: string | {[errorType: string]: string};
  };
}

@Component({
  selector: 'app-upload-step-three',
  templateUrl: './upload-step-three.component.html',
  styleUrls: ['./upload-step-three.component.css']
})
export class UploadStepThreeComponent implements OnInit {
  @Input() form = new FormGroup({
    data: new FormArray([])
  });
  @Input() unitHeaders: string[] = [];
  @Input() unitControlNames: string[] = [];
  @Input() exclamation = '';
  @Output() unitFormChange = new EventEmitter<FormGroup>();

  @Input() controlValidatioMessages = {} as ControlValidationMessages;
  get data(): FormArray {
    return this.form.get('data') as FormArray;
  }
  invalidControls = 0;

  constructor() {}

  ngOnInit(): void {
    
    this.unitFormChange.emit(this.form);
    this.invalidControls = this.countInvalidControls();
    
    this.form.valueChanges.subscribe(() => {
      this.unitFormChange.emit(this.form);
      this.invalidControls = this.countInvalidControls();
    });
  }

  countInvalidControls() {
    let count = 0;
    this.data.controls.forEach((control: AbstractControl) => {
      if (control instanceof FormGroup) {
        const formGroup = control as FormGroup;
        Object.keys(formGroup.controls).forEach((controlName: string) => {
          const control = formGroup.controls[controlName];
          if (control.invalid) {
            count++;
          }
        });
      }
    });
    return count;
  }

  getErrorMessage(control: AbstractControl | null, controlName: string): string | undefined {
    const formControl = control as FormControl;
    const errors = formControl.errors;
    const errorMessages = this.controlValidatioMessages[controlName];
    const messages = [];

    if (!control || !errors) {
      return undefined;
    }

    for (let errorName in errors) {
      if (errors[errorName]) {
        messages.push(errorMessages[errorName]);
      }
    }
    return messages.join(', ') + '.';
  }

  getControlType(controlName: string): string {
    if (this.isNumberField(controlName)) {
      return 'number';
    } else {
      return 'text';
    }
  }

  isNumberField(controlName: string): boolean {
    const numberFields = ['beds', 'areaSize'];
    return numberFields.includes(controlName);
  }
}
