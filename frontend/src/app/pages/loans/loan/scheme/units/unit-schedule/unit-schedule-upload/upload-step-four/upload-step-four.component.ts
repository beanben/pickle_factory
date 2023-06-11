import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { AssetClassType } from "src/app/_types/custom.type";

interface ControlValidationMessages {
  [controlName: string]: {
    [errorType: string]: string | { [errorType: string]: string };
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

  // @Input() content: string[][] = [];
  // @Input() assetClass = {} as AssetClassType;
  // @Input() unitControlNames: string[] = [];
  // @Input() saleControlNames: string[] = [];
  // @Input() leaseControlNames: string[] = [];
  // @Input() unitHeaders: string[] = [];
  // @Input() leaseHeaders: string[] = [];
  // @Input() saleHeaders: string[] = [];
  // exclamation = 'assets/images/exclamation.svg';

  // form = new FormGroup({
  //   data: new FormArray([])
  // });
  get data(): FormArray {
    return this.form.get('data') as FormArray;
  }
  // headers: string[] = [];
  // controlNames: string[] = [];
  // numbersOnly = /^(0|[1-9][0-9]*)$/;
  // decimalsOnly = /^([0-9]\d*(\.\d+)?)$/;
  

  // validationMessages: ValidationMessages = {
  //   unit: {
  //     identifier: {
  //       required: 'Identifier is required',
  //       uniqueValue: 'Identifier must be unique'
  //     },
  //     description: {
  //       required: 'Description is required'
  //     },
  //     areaSize: {
  //       required: 'Area is required',
  //       pattern: 'Area must be a valid number'
  //     },
  //     beds: {
  //       pattern: 'Number of beds must be a valid number',
  //       required: 'At least one bed is required'
  //     }
  //   },
  //   sale: {
  //     priceTarget: {
  //       pattern: 'Sale price target must be a valid positive number'
  //     },
  //     priceAchieved: {
  //       pattern: 'Sale price achieved must be a valid positive number'
  //     },
  //     status: {
  //       statusPriceError: 'Status cannot be available if price achieved is above 0'
  //     }
  //   },
  //   lease: {
  //     rentTarget: {
  //       pattern: 'Rent target must be a valid positive number'
  //     },
  //     rentAchieved: {
  //       pattern: 'Rent achieved must be a valid positive number'
  //     }
  //   }
  // };

  constructor() {}

  ngOnInit() {
    // await this.defineHeadersAndControlNames();
    // this.form = this.createFormFromContent(this.content);
    this.saleOrLeaseFormChange.emit(this.form);
    this.form.valueChanges.subscribe(() => {
      this.saleOrLeaseFormChange.emit(this.form);
    });
  }

  // async defineHeadersAndControlNames() {
  //   if(this.assetClass.investmentStrategy === "buildToSell") {
  //     this.headers = [this.unitHeaders[0], ...this.saleHeaders];
  //     this.controlNames = [this.unitControlNames[0], ...this.saleControlNames];
  //   } else {
  //     this.headers = [this.unitHeaders[0], ...this.leaseHeaders];
  //     this.controlNames = [this.unitControlNames[0], ...this.leaseControlNames];
  //   }
  // }

  //   // create form from content. First row represents headers
  //   private createFormFromContent(content: string[][]) {
  //     const form = new FormGroup({
  //       data: new FormArray([])
  //     });

  //     const headers = this.controlNames;

  //     const validatorsMap: {[key: string]: ValidatorFn[]} = {
  //       status: [this.saleStatusValidator()],
  //       statusDate: [],
  //       priceTarget: [Validators.required, Validators.pattern(this.decimalsOnly)],
  //       priceAchieved: [Validators.pattern(this.decimalsOnly)],
  //       buyer: [],
  //       ownershipType: [],

  //       startDate: [],
  //       endDate: [],
  //       rentTarget: [Validators.pattern(this.decimalsOnly)],
  //       rentAchieved: [Validators.pattern(this.decimalsOnly)],
  //       tenant: [],
  //       leaseType: [],
  //     }

  //     const unitControlLenght = this.unitControlNames.length;

  //     for (let i = 1; i < content.length; i++) {
  //       const row = content[i].slice(0, 1).concat(content[i].slice(unitControlLenght));
  //       const rowForm = new FormGroup({});

  //       rowForm.addControl(headers[0], new FormControl(content[i][0]));
  //       for (let j = 1; j < headers.length; j++) {
  //         const header = headers[j];
  //         const value = row[j];
  //         const validators = validatorsMap[header];

  //         rowForm.addControl(header, new FormControl(value, validators));
  //       }

  //       (form.get('data') as FormArray).push(rowForm);
  //     }

  //     return form
  //   }

  // getErrorMessage(control: AbstractControl | null, controlName: string): string | undefined {
  //   const formControl = control as FormControl;
  //   const errors = formControl.errors;

  //   let errorMessages
  //   if(this.assetClass.investmentStrategy === "buildToSell") {
  //     errorMessages = this.validationMessages['sale'][controlName]
  //   } else {
  //     errorMessages = this.validationMessages['lease'][controlName]
  //   }
    
  //   const messages = [];

  //   if (!control || !errors) {
  //     return undefined;
  //   }

  //   for (let errorName in errors) {
  //     if (errors[errorName]) {
  //       messages.push(errorMessages[errorName]);
  //     }
  //   }
  //   return messages.join(', ')+ '.';
  // }

  // saleStatusValidator(): ValidatorFn {
  //   return (control: AbstractControl) => {
  //     const status = control.value;

  //     if (control.parent) {
  //       const formGroupParent = control.parent as FormGroup;
  //       const priceAchieved = formGroupParent.get('priceAchieved')?.value || 0;

  //       if (status === 'available' && Number(priceAchieved) > 0) {
  //         // console.log('status: ', status, 'priceAchieved: ', priceAchieved);

  //         return {statusPriceError: true}; // Returning custom error object
  //       }
  //     }

  //     return null; // If validation passed, return null
  //   };
  // }

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
