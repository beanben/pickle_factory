import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';

interface ControlValidationMessages {
  [controlName: string]: {
    [errorType: string]: string | { [errorType: string]: string };
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

  constructor() {}

  ngOnInit(): void {
    this.unitFormChange.emit(this.form);
    this.form.valueChanges.subscribe(() => {
      this.unitFormChange.emit(this.form);
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
        messages.push(errorMessages[errorName]);
      }
    }
    return messages.join(', ') + '.';
  }
}
