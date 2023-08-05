import {DatePipe} from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {LeaseStructure, Scheme, UnitScheduleData, UnitStructure} from 'src/app/_interfaces/scheme.interface';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {UnitService} from 'src/app/_services/unit/unit.service';
import {AssetClassType} from 'src/app/_types/custom.type';

interface ValidationMessages {
  [category: string]: {
    [controlName: string]: {
      [errorType: string]: string | {[errorType: string]: string};
    };
  };
}

interface ControlValidationMessages {
  [controlName: string]: {
    [errorType: string]: string | {[errorType: string]: string};
  };
}

@Component({
  providers: [DatePipe],
  selector: 'app-unit-schedule-upload',
  templateUrl: './unit-schedule-upload.component.html'
  // styleUrls: ['./unit-schedule-upload.component.css']
})
export class UnitScheduleUploadComponent implements OnInit, OnChanges, OnDestroy {
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
  saleForm = new FormGroup({});
  leaseForm = new FormGroup({});
  private destroy$ = new Subject<boolean>();
  importAllowed = false;

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
  unitScheduleData: UnitScheduleData[] = [];

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
        // pattern: 'Area must be a valid number',
        positiveNumber: 'Area must be a valid positive number'
      },
      beds: {
        // pattern: 'Number of beds must be a valid number',
        required: 'At least one bed is required',
        positiveNumber: 'Number of beds must be a valid positive number'
      }
    },
    sale: {
      priceTarget: {
        positiveNumber: 'Sale price target must be a valid positive number',
        required: 'Sale price target is required'
      },
      priceAchieved: {
        positiveNumber: 'Sale price achieved must be a valid positive number'
      },
      status: {
        required: 'Status is required',
        statusPriceError: {
          available: 'Status cannot be available if price achieved is above 0',
          notAvailable: 'Status must be available if price achieved is 0'
        },
        invalidChoice: ''
      },
      statusDate: {
        dateInvalid: 'date must be in format DD/MM/YYYY'
      },
      ownershipType: {
        required: 'A type is required',
        invalidChoice: ''
      }
    },
    lease: {
      startDate: {
        dateInvalid: 'date must be in format DD/MM/YYYY'
      },
      endDate: {
        dateInvalid: 'date must be in format DD/MM/YYYY'
      },
      rentTarget: {
        positiveNumber: 'Rent target must be a valid positive number'
      },
      rentAchieved: {
        positiveNumber: 'Rent achieved must be a valid positive number'
      }
    }
  };
  numbersOnly = /^(0|[1-9][0-9]*)$/;
  decimalsOnly = /^([0-9]\d*(\.\d+)?)$/;

  constructor(private datePipe: DatePipe, private el: ElementRef, private _unitService: UnitService) {}

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

  onCloseModal() {
    this.onCancel();
  }

  // onSaveModal(unitScheduleData: UnitScheduleData[]){
  //   this.modalUploadUnitSchedule.emit(unitScheduleData);
  //   this.onCancel();
  // }
  onSaveUnitsSchedule(unitScheduleData: UnitScheduleData[]) {
    this.unitScheduleData = unitScheduleData;
  }

  onCancel() {
    if (this.unitScheduleData.length > 0) {
      this.modalUploadUnitSchedule.emit(this.unitScheduleData);
    } else {
      this.modalUploadUnitSchedule.emit(null);
    }

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

    this.updateValidationMessages();

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

  updateValidationMessages() {
    const saleStatusValidLabels = this.saleStatusChoices.map(choice => choice.label).join(', ') + '.';
    const saleOwnershipTypeValidLabels = this.ownershipTypeChoices.map(choice => choice.label).join(', ');
    this.validationMessages['sale']['status'][
      'invalidChoice'
    ] = `Status must be one of the following: ${saleStatusValidLabels}`;
    this.validationMessages['sale']['ownershipType'][
      'invalidChoice'
    ] = `Type must be one of the following: ${saleOwnershipTypeValidLabels}`;
  }

  handleSaleOrLeaseFormChange(saleOrLeaseForm: FormGroup) {
    if (saleOrLeaseForm.invalid) {
      return;
    }
    if (this.assetClass.investmentStrategy === 'buildToSell') {
      this.saleForm = saleOrLeaseForm;
    } else {
      this.leaseForm = saleOrLeaseForm;
    }
  }

  saleOrLeaseContent(content: string[][]): string[][] {
    const unitHeadersLength = this.unitHeaders.length;
    return content.map((row: string[]) => {
      return [...row.slice(unitHeadersLength)];
    });
  }

  disableNext(): boolean {
    let disable: boolean;
    if (this.step === 1) {
      disable = !this.isChecked;
    } else if (this.step === 2) {
      disable = !this.headersAreValid;
    } else if (this.step === 3) {
      disable = this.unitForm.invalid || Object.keys(this.unitForm.value).length === 0;
    } else if (this.step === 4) {
      this.importAllowed = this.saleOrLeaseForm.invalid || Object.keys(this.saleOrLeaseForm.value).length === 0;
      disable = this.importAllowed;
    } else {
      disable = false;
    }

    return disable;
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
      beds: [Validators.required, this.positiveNumberValidator()],
      areaSize: [Validators.required, this.positiveNumberValidator()],
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
      status: [Validators.required, this.choiceValidator(this.saleStatusChoices)],
      statusDate: [this.dateValidator()],
      priceTarget: [Validators.required, this.positiveNumberValidator()],
      priceAchieved: [this.positiveNumberValidator()],
      buyer: [],
      ownershipType: [Validators.required, this.choiceValidator(this.ownershipTypeChoices)]
    };

    for (let i = 0; i < content.length; i++) {
      const row = content[i];
      const rowForm = new FormGroup({}, {validators: this.saleStatusValidator()});

      rowForm.addControl('unitIdentifier', (unitForm.get('data') as FormArray).at(i).get('identifier')!);
      for (let j = 0; j < controlNames.length; j++) {
        const controlName = controlNames[j];
        let controlValue = row[j];

        if (controlName.toLowerCase().includes('date') && controlValue) {
          const transformedDate = this.datePipe.transform(controlValue, 'dd/MM/yyyy');
          controlValue = transformedDate ? transformedDate : controlValue;
        }

        const control = new FormControl(controlValue, validatorsMap[controlName]);
        rowForm.addControl(controlName, control);
      }

      rowForm
        .get('priceAchieved')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          rowForm.get('status')?.updateValueAndValidity();
        });

      (form.get('data') as FormArray).push(rowForm);
    }

    return form;
  }

  createLeaseForm(content: string[][], controlNames: string[], unitForm: FormGroup) {
    const form = new FormGroup({
      data: new FormArray([])
    });

    const validatorsMap: {[key: string]: ValidatorFn[]} = {
      startDate: [this.dateValidator()],
      endDate: [this.dateValidator()],
      rentTarget: [this.positiveNumberValidator()],
      rentAchieved: [this.positiveNumberValidator()],
      tenant: [],
      leaseType: []
    };

    for (let i = 0; i < content.length; i++) {
      const row = content[i];
      const rowForm = new FormGroup({});

      rowForm.addControl('unitIdentifier', (unitForm.get('data') as FormArray).at(i).get('identifier')!);
      for (let j = 0; j < controlNames.length; j++) {
        const controlName = controlNames[j];
        let controlValue = row[j];

        if (controlName.toLowerCase().includes('date') && controlValue) {
          const dateObject = new Date(controlValue);

          if (!isNaN(dateObject.getTime())) {
            const transformedDate = this.datePipe.transform(dateObject, 'dd/MM/yyyy');
            controlValue = transformedDate ? transformedDate : controlValue;
          }
        }

        const control = new FormControl(controlValue, validatorsMap[controlName]);
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
    return (formGroup: AbstractControl) => {
      const statusControl = formGroup.get('status');
      const priceAchievedControl = formGroup.get('priceAchieved');

      if (!statusControl || !priceAchievedControl) {
        return null;
      }

      const status = statusControl?.value;
      const priceAchieved = priceAchievedControl.value || 0;

      // if (status === null || status === '') {
      //   return null;
      // }

      if (!status) {
        return null;
      }

      if (status.toLowerCase() === 'available' && Number(priceAchieved) > 0) {
        statusControl?.setErrors({statusPriceError: 'available'});
        return {statusPriceError: 'available'};
      }
      if (status.toLowerCase() !== 'available' && Number(priceAchieved) === 0) {
        statusControl?.setErrors({statusPriceError: 'notAvailable'});
        return {statusPriceError: 'notAvailable'};
      }

      // statusControl?.updateValueAndValidity({emitEvent: false});
      return null;
    };
  }

  choiceValidator(choices: Choice[]): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === null || control.value === '') {
        return null;
      }

      const valid = choices.some(choice => choice.label.toLowerCase() === control.value.toLowerCase());

      return valid ? null : {invalidChoice: {value: control.value}};
    };
  }

  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === null || control.value === '') {
        return null;
      }

      let numValue: number = parseFloat(control.value);

      if (isNaN(numValue) || numValue < 0) {
        return {positiveNumber: {value: control.value}};
      }
      return null;
    };
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;

      if (!value) {
        return null;
      }

      if (value instanceof Date) {
        return null;
      }

      const dateRegex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/(\d{4})$/;
      const isValid = dateRegex.test(value);

      return isValid ? null : {dateInvalid: true};
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
