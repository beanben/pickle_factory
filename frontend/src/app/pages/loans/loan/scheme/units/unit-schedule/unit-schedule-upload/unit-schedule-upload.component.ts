import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {LeaseStructure, Scheme, UnitScheduleData, UnitStructure} from 'src/app/_interfaces/scheme.interface';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {UnitService} from 'src/app/_services/unit/unit.service';
import {AssetClassType} from 'src/app/_types/custom.type';

interface ValidationMessages {
  [category: string]: {
    [controlName: string]: {
      [errorType: string]: string | { [errorType: string]: string };
    };
  };
}

interface ControlValidationMessages {
  [controlName: string]: {
    [errorType: string]: string | { [errorType: string]: string };
  };
}

@Component({
  selector: 'app-unit-schedule-upload',
  templateUrl: './unit-schedule-upload.component.html'
  // styleUrls: ['./unit-schedule-upload.component.css']
})
export class UnitScheduleUploadComponent implements OnInit, OnChanges {
  displayStyle = 'block';
  isChecked = false;
  selectFileStatus = 'active';
  dataValidationStatus = 'inactive';
  uploadStatus = 'inactive';
  step = 1;
  data = {} as Uint8Array;
  headersAreValid = false;
  unitFormIsValid = false;
  unitForm = new FormGroup({});
  saleOrLeaseForm = new FormGroup({});
  saleOrLeaseControlNames: string[] = [];

  @Output() modalUploadUnitSchedule = new EventEmitter<UnitScheduleData[] | null>();
  @Input() unitStructure = {} as UnitStructure;
  @Input() leaseStructure = {} as LeaseStructure;
  @Input() assetClass = {} as AssetClassType;
  @Input() scheme = {} as Scheme;
  @Input() ownershipTypeChoices: Choice[] = [];
  @Input() leaseTypeChoices: Choice[] = [];
  @Input() saleStatusChoices: Choice[] = [];
  @Input() rentFrequencyChoices: Choice[] = [];
  content: string[][] = [];
  saleOrLeaseHeaders: string[] = [];
  unitHeaders: string[] = [];
  leaseHeaders: string[] = [];
  saleHeaders: string[] = [];
  controlNames: string[] = [];
  unitControlNames: string[] = [];
  saleControlNames: string[] = [];
  leaseControlNames: string[] = [];
  exclamation = 'assets/images/exclamation.svg';

  unitValidatioMessages = {} as ControlValidationMessages;
  saleOrLeaseValidatioMessages = {} as ControlValidationMessages;
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
        required: 'Area is required',
        pattern: 'Area must be a valid number'
      },
      beds: {
        pattern: 'Number of beds must be a valid number',
        required: 'At least one bed is required'
      }
    },
    sale: {
      priceTarget: {
        pattern: 'Sale price target must be a valid positive number',
        required: 'Sale price target is required'
      },
      priceAchieved: {
        pattern: 'Sale price achieved must be a valid positive number'
      },
      status: {
        required: 'Status is required',
        statusPriceError: {
          available: 'Status cannot be available if price achieved is above 0',
          notAvailable: 'Status must be available if price achieved is 0',
        },
        invalidChoice: ''
      },
      ownershipType: {
        required: 'A type is required',
        invalidChoice: ''
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
  numbersOnly = /^(0|[1-9][0-9]*)$/;
  decimalsOnly = /^([0-9]\d*(\.\d+)?)$/;

  constructor(private el: ElementRef, private _unitService: UnitService) {}

  ngOnInit(): void {
    this.addEventBackgroundClose();
    this.getFieldsAndControlNames();
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  }

  onCancel() {
    this.modalUploadUnitSchedule.emit(null);
    this._unitService.setFileNameSub('');
  }

  onNext() {
    this.step += 1;
  }

  onPrevious() {
    this.step--;
  }

  onCheckboxChanged(isChecked: boolean) {
    this.isChecked = isChecked;
  }

  handleContentUpload(content: string[][]) {
    if (content.length > 0) {
      this.content = content.slice(1);
      this.headersAreValid = true;
      this.unitForm = this.createUnitForm(this.content, this.unitControlNames);
      this.unitValidatioMessages = this.validationMessages['unit'];
    }
  }

  handleHeadersChange(isValid: boolean) {
    return (this.headersAreValid = isValid);
  }

  handleUnitFormChange(unitForm: FormGroup) {
    this.unitForm = unitForm;
    if (!this.unitForm.valid) {
      return;
    }

    const content: string[][] = this.saleOrLeaseContent(this.content);

    if (Object.keys(this.saleOrLeaseForm.value).length > 0) {
      return;
    }
    const saleStatusValidLabels = this.saleStatusChoices.map(choice => choice.label).join(', ')+'.'
    const saleOwnershipTypeValidLabels = this.ownershipTypeChoices.map(choice => choice.label).join(', ')
    this.validationMessages['sale']['status']['invalidChoice'] = `Status must be one of the following: ${saleStatusValidLabels}`;
    this.validationMessages['sale']['ownershipType']['invalidChoice'] = `Type must be one of the following: ${saleOwnershipTypeValidLabels}`;

    if (this.assetClass.investmentStrategy === 'buildToSell') {
      this.saleOrLeaseHeaders = [this.unitHeaders[0], ...this.saleHeaders];
      this.saleOrLeaseControlNames = this.saleControlNames;
      this.saleOrLeaseForm = this.createSaleForm(content, this.saleControlNames, unitForm);
      this.saleOrLeaseValidatioMessages = this.validationMessages['sale'];
    } else {
      this.saleOrLeaseHeaders = [this.unitHeaders[0], ...this.leaseHeaders];
      this.saleOrLeaseForm = this.createLeaseForm(content, this.leaseControlNames, unitForm);
      this.saleOrLeaseControlNames = this.leaseControlNames;
      this.saleOrLeaseValidatioMessages = this.validationMessages['lease'];
    }
    // insert in first pace of saleOrLeaseControlNames, "unitIdentifier"
    this.saleOrLeaseControlNames.splice(0, 0, 'unitIdentifier');
  }

  saleOrLeaseContent(content: string[][]): string[][] {
    const unitHeadersLength = this.unitHeaders.length;
    return content.map((row: string[]) => {
      return [...row.slice(unitHeadersLength)];
    });
  }

  disableNext(): boolean {
    if (this.step === 1) {
      return !this.isChecked;
    } else if (this.step === 2) {
      return !this.headersAreValid;
    } else if (this.step === 3) {
      return this.unitForm.invalid;
    } else {
      return false;
    }
  }

  getFieldsAndControlNames() {
    this.unitHeaders = this._unitService.displayUnitFields(this.assetClass, this.scheme);
    this.saleHeaders = this._unitService.displaySaleFields(this.assetClass);
    this.leaseHeaders = this._unitService.displayLeaseFields(this.assetClass);

    this.unitControlNames = this._unitService.getUnitControlNames(this.assetClass, this.scheme);
    this.saleControlNames = this._unitService.getSaleControlNames(this.assetClass);
    this.leaseControlNames = this._unitService.getLeaseControlNames(this.assetClass);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assetClass'] && changes['assetClass'].currentValue) {
      this.getFieldsAndControlNames();
    }
  }

  createUnitForm(content: string[][], controlNames: string[]): FormGroup {
    // to ensure user can navigate away and come back on the form
    if (Object.keys(this.unitForm.value).length > 0) {
      return this.unitForm;
    }

    const form = new FormGroup({
      data: new FormArray([])
    });

    const validatorsMap: {[key: string]: ValidatorFn[]} = {
      identifier: [Validators.required, this.uniqueValueValidator(form.get('data') as FormArray, 'identifier')],
      description: [Validators.required],
      beds: [Validators.required, Validators.pattern(this.numbersOnly)],
      areaSize: [Validators.required, Validators.pattern(this.decimalsOnly)],
      id: [] // no validators
    };

    for (let i = 0; i < content.length; i++) {
      const row = content[i];
      const rowForm = new FormGroup({});

      for (let j = 0; j < controlNames.length; j++) {
        const controlName = controlNames[j];
        const control = new FormControl(row[j], validatorsMap[controlName]);
        rowForm.addControl(controlName, control);
      }

      (form.get('data') as FormArray).push(rowForm);
    }

    return form;
  }
  createSaleForm(content: string[][], controlNames: string[], unitForm: FormGroup) {
    const form = new FormGroup({
      data: new FormArray([])
    });

    const validatorsMap: {[key: string]: ValidatorFn[]} = {
      status: [Validators.required, this.saleStatusValidator(), this.choiceValidator(this.saleStatusChoices)],
      statusDate: [],
      priceTarget: [Validators.required, Validators.pattern(this.decimalsOnly)],
      priceAchieved: [Validators.pattern(this.decimalsOnly)],
      buyer: [],
      ownershipType: [Validators.required, this.choiceValidator(this.ownershipTypeChoices)],
    };

    for (let i = 0; i < content.length; i++) {
      const row = content[i];
      const rowForm = new FormGroup({});

      rowForm.addControl('unitIdentifier', (unitForm.get('data') as FormArray).at(i).get('identifier')!);
      for (let j = 0; j < controlNames.length; j++) {
        const controlName = controlNames[j];
        const control = new FormControl(row[j], validatorsMap[controlName]);
        rowForm.addControl(controlName, control);
      }

      (form.get('data') as FormArray).push(rowForm);
    }

    return form;
  }

  createLeaseForm(content: string[][], controlNames: string[], unitForm: FormGroup) {
    const form = new FormGroup({
      data: new FormArray([])
    });

    const validatorsMap: {[key: string]: ValidatorFn[]} = {
      startDate: [],
      endDate: [],
      rentTarget: [Validators.pattern(this.decimalsOnly)],
      rentAchieved: [Validators.pattern(this.decimalsOnly)],
      tenant: [],
      leaseType: []
    };

    for (let i = 0; i < content.length; i++) {
      const row = content[i];
      const rowForm = new FormGroup({});

      rowForm.addControl('unitIdentifier', (unitForm.get('data') as FormArray).at(i).get('identifier')!);
      for (let j = 0; j < controlNames.length; j++) {
        const controlName = controlNames[j];
        const control = new FormControl(row[j], validatorsMap[controlName]);
        rowForm.addControl(controlName, control);
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

  saleStatusValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const status = control.value;

      if (control.parent) {
        const formGroupParent = control.parent as FormGroup;
        const priceAchieved = formGroupParent.get('priceAchieved')?.value || 0;

        if (status.toLowerCase() === 'available' && Number(priceAchieved) > 0) {
          return {statusPriceError: 'available'};
        }
        if(status.toLowerCase() !== 'available' && Number(priceAchieved) === 0) {
          return {statusPriceError: 'notAvailable'};
        }
      }

      return null;
    };
  }

  choiceValidator(choices: Choice[]): ValidatorFn {
    return (control: AbstractControl) => {
      const valid = choices.some(choice => choice.label.toLowerCase() === control.value.toLowerCase());
      return valid ? null : {invalidChoice: {value: control.value}};
    };
  }

}
