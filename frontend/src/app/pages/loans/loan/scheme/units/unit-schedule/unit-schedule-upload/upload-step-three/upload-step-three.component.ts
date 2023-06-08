import {Component, HostListener, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {UnitService} from 'src/app/_services/unit/unit.service';

interface ValidationMessages {
  [category: string]: {
    [controlName: string]: {
      [errorType: string]: string;
    };
  };
}

@Component({
  selector: 'app-upload-step-three',
  templateUrl: './upload-step-three.component.html',
  styleUrls: ['./upload-step-three.component.css']
})
export class UploadStepThreeComponent implements OnInit {
  @Input() content: string[][] = [];
  form = new FormGroup({
    data: new FormArray([])
  });
  @Input() unitHeaders: string[] = [];
  @Input() unitControlNames: string[] = [];
  numbersOnly = /^(0|[1-9][0-9]*)$/;
  decimalsOnly = /^([0-9]\d*(\.\d+)?)$/;
  exclamation = 'assets/images/exclamation.svg';

  get data(): FormArray {
    return this.form.get('data') as FormArray;
  }
  validationMessages: ValidationMessages = {
    unit: {
      identifier: {
        required: 'Identifier is required',
        uniqueValue: 'Identifier must be unique'
      },
      description: {
        required: 'Description is required'
      },
      areaSize: {
        pattern: 'Area must be a valid number'
      },
      beds: {
        pattern: 'Number of beds must be a valid number',
        atLeastOne: 'At least one bed is required'
      }
    },
    sale: {
      priceTarget: {
        pattern: 'Sale price target must be a valid positive number'
      },
      priceAchieved: {
        pattern: 'Sale price achieved must be a valid positive number'
      },
      status: {
        statusPriceError: 'Status cannot be available if price achieved is above 0'
      }
    },
    lease: {
      rentTarget: {
        pattern: 'Rent target must be a valid positive number'
      },
      rentAchieved: {
        pattern: 'Rent achieved must be a valid positive number'
      }
    }
  };
  tooltipIndex: number | null = null;
  tooltipControlName: string | null = null;
  show = false

  constructor(private _unitService: UnitService) {}

  ngOnInit(): void {
    this.form = this.createFormFromContent(this.content);
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['content'] && changes['content'].currentValue) {
  //     this.createFormFromContent(this.content);
  //   }
  // }

  // create form from content. First row represents headers
  private createFormFromContent(content: string[][]) {
    const form = new FormGroup({
      data: new FormArray([])
    });

    const headers = this.unitControlNames;

    const validatorsMap: {[key: string]: ValidatorFn[]} = {
      identifier: [Validators.required, this.uniqueValueValidator(form.get('data') as FormArray, 'identifier')],
      description: [Validators.required],
      beds: [Validators.required, Validators.pattern(this.numbersOnly)],
      areaSize: [Validators.required, Validators.pattern(this.decimalsOnly)],
      id: [] // no validators
    };

    for (let i = 1; i < content.length; i++) {
      const row = content[i];
      const rowForm = new FormGroup({});

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        const control = new FormControl(row[j], validatorsMap[header]);
        rowForm.addControl(header, control);
      }

      (form.get('data') as FormArray).push(rowForm);
    }

    return form;
  }

  uniqueValueValidator(formArray: FormArray, controlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (!(control instanceof FormControl)) {
        return null;
      }

      const currentControl = control;

      const duplicateControl = formArray.controls.find((control: AbstractControl) => {
        const formGroup = control as FormGroup;
        const formControl = formGroup.get(controlName) as FormControl;

        return currentControl !== formControl && currentControl?.value === formControl.value;
      });

      return duplicateControl ? {uniqueValue: true} : null;
    };
  }

  // atLeastOneValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;

  //     const unitHeaders = this.unitHeaders.map((header: string) => header.toLowerCase() );

  //     if (!unitHeaders.includes('beds')) {
  //       return null;
  //     }

  //     return !value || value === 0 ? {atLeastOne: true} : null;
  //   };
  // }
  getErrorMessage(category: string, control: FormControl, fieldName: string): string[] {
    // const errorMessages = this.validationMessages[category][fieldName];
    // const errors = control.errors;
    const messages: string[] = [];

    // if (!errors) {
    //   return messages;
    // }

    // for (let errorName in errors) {
    //   if (errors[errorName]) {
    //     messages.push(errorMessages[errorName]);
    //   }
    // }

    return messages;
  }

  showTooltip(index: number, controlName: string) {
    this.tooltipIndex = index;
    this.tooltipControlName = controlName;
    this.show = !this.show;
  }

  isTooltipVisible(index: number, controlName: string) {
    return this.tooltipIndex === index && this.tooltipControlName === controlName && this.show;
  }
}
