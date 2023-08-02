import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';

interface ControlValidationMessages {
  [controlName: string]: {
    [errorType: string]: string | {[errorType: string]: string};
  };
}
@Component({
  selector: 'app-upload-step-four',
  templateUrl: './upload-step-four.component.html',
  styleUrls: ['./upload-step-four.component.css']
})
export class UploadStepFourComponent implements OnInit {
  @Input() form = new FormGroup({
    data: new FormArray([])
  });
  @Input() headers: string[] = [];
  @Input() controlNames: string[] = [];
  @Input() exclamation = '';
  @Output() saleOrLeaseFormChange = new EventEmitter<FormGroup>();

  @Input() controlValidatioMessages = {} as ControlValidationMessages;

  get data(): FormArray {
    return this.form.get('data') as FormArray;
  }
  invalidControls = 0;

  constructor() {}

  ngOnInit() {
    this.saleOrLeaseFormChange.emit(this.form);
    this.invalidControls = this.countInvalidControls();

    this.form.valueChanges.subscribe(() => {
      this.saleOrLeaseFormChange.emit(this.form);
      this.invalidControls = this.countInvalidControls();
    });
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
        const errorMessage = errorMessages[errorName];

        if (typeof errorMessage === 'string') {
          messages.push(errorMessage);
        } else if (typeof errorMessage === 'object') {
          const subErrorMessage = errorMessage[errors[errorName]];
          messages.push(subErrorMessage);
        }
      }
    }

    return messages.join(', ') + '.';
  }

  getControlType(controlName: string): string {
    if (this.isDateField(controlName)) {
      return 'date';
    } else if (this.isNumberField(controlName)) {
      return 'number';
    } else {
      return 'text';
    }
  }

  isNumberField(controlName: string): boolean {
    const saleNumbeFields = ['priceTarget', 'priceAchieved'];
    const leaseNumberFields = ['rentTarget', 'rentAchieved'];
    return saleNumbeFields.includes(controlName) || leaseNumberFields.includes(controlName);
  }

  isDateField(controlName: string): boolean {
    return controlName.toLowerCase().includes('date');
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

}
