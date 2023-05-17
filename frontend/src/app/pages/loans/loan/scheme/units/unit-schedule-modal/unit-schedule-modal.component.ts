import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {SchemeService} from 'src/app/_services/scheme/scheme.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Subscription, lastValueFrom} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {UnitService} from 'src/app/_services/unit/unit.service';
import {
  Lease,
  LeaseStructure,
  Sale,
  Scheme,
  Unit,
  UnitScheduleData,
  UnitStructure
} from 'src/app/_interfaces/scheme.interface';
import {AssetClassType} from 'src/app/_types/custom.type';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {SharedService} from 'src/app/_services/shared/shared.service';

interface ValidationMessages {
  [formGroupName: string]: {
    [controlName: string]: {
      [errorType: string]: string;
    };
  };
}

@Component({
  selector: 'app-unit-schedule-modal',
  templateUrl: './unit-schedule-modal.component.html',
  styleUrls: ['./unit-schedule-modal.component.css']
})
export class UnitScheduleModalComponent implements OnInit, OnDestroy {
  displayStyle = 'block';
  @Input() mode = '';
  @Input() unitsScheduleData: UnitScheduleData[] = [];

  @Input() assetClass = {} as AssetClassType;
  @Input() scheme = {} as Scheme;
  @Input() unitStructure = {} as UnitStructure;
  @Input() leaseStructure = {} as LeaseStructure;
  @Output() modalSaveUnitsSchedule = new EventEmitter<UnitScheduleData[] | null>();
  @Input() saleStatusChoices: Choice[] = [];
  @Input() rentFrequencyChoices: Choice[] = [];
  leaseFrequencyChoices: Choice[] = [];
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  totalSalePriceTarget = 0;
  totalSalePriceAchieved = 0;
  averageLeaseRentTarget = 0;
  averageLeaseRentAchieved = 0;
  unitsToDelete: Unit[] = [];
  rentFrequencyLabel = '';
  leaseFrequencyLabel = '';
  index = -1;
  // unitSelected = {} as Unit;
  numbersOnly = /^\d+$/;
  decimalsOnly = /^\d*\.?\d*$/;
  step = 1;
  chevronRight = 'assets/images/chevronRight.svg';
  unitsStatus = 'active';
  salesStatus = 'inactive';
  lettingsStatus = 'inactive';
  nextIsClicked = false;
  subs: Subscription[] = [];
  showResetIcon = false;

  form: FormGroup = this.fb.group({
    unitsScheduleData: this.fb.array([])
  });

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
        pattern: 'Sale price target must be a valid number'
      },
      priceAchieved: {
        pattern: 'Sale price achieved must be a valid number'
      }
    },
    lease: {
      rentTarget: {
        pattern: 'Rent target must be a valid number'
      },
      rentAchieved: {
        pattern: 'Rent achieved must be a valid number'
      }
    }
  };

  get unitsScheduleFormArray(): FormArray {
    return this.form.get('unitsScheduleData') as FormArray;
  }

  constructor(
    private el: ElementRef,
    private _schemeService: SchemeService,
    private _unitService: UnitService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.addEventBackgroundClose();
    this.calculateTotals();
    this.populateForm();
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  }

  onCancel() {
    this.modalSaveUnitsSchedule.emit(null);
  }

  async getChoices(choiceType: string, targetArray: Choice[]): Promise<void> {
    const choices$ = this.sharedService.getChoices(choiceType);
    const choices: Choice[] = await lastValueFrom(choices$);

    targetArray.push(...choices);
  }

  calculateTotals() {
    this.totalUnits = this.unitsScheduleFormArray.length;
    this.totalAreaSize = this.calculateTotalForFormControl('unit', 'areaSize', 2);
    this.totalBeds = this.calculateTotalForFormControl('unit', 'beds');

    if (this.assetClass.investmentStrategy === 'buildToRent') {
      this.averageLeaseRentTarget = this.calculateAverageFromFormControls('lease', 'rentTargetAmount', 2);
      this.averageLeaseRentAchieved = this.calculateAverageFromFormControls('lease', 'rentAchievedAmount', 2);
    } else {
      this.totalSalePriceTarget = this.calculateTotalForFormControl('sale', 'priceTarget', 2);
      this.totalSalePriceAchieved = this.calculateTotalForFormControl('sale', 'priceAchieved', 2);
    }
  }

  calculateTotalForFormControl(formGroupName: string, controlName: string, decimalPrecision = 0): number {
    return this.unitsScheduleFormArray.controls
      .map(control => control.get(formGroupName)?.get(controlName)?.value || 0)
      .reduce((sum, currentValue) => sum + Number(currentValue), 0)
      .toFixed(decimalPrecision);
  }

  calculateAverageFromFormControls(formGroupName: string, controlName: string, decimalPrecision = 0): number {
    const total = this.calculateTotalForFormControl(formGroupName, controlName, decimalPrecision);
    return this.totalUnits === 0 ? 0 : +(total / this.totalUnits).toFixed(decimalPrecision);
  }

  unitToFormGroup(unit?: Unit): FormGroup {
    const unitForm = this.fb.group({
      identifier: [unit?.identifier, [Validators.required, this.uniqueValueValidator('unit', 'identifier')]],
      description: [unit?.description, Validators.required],
      beds: [unit?.beds, [Validators.pattern(this.numbersOnly), this.atLeastOneValditor()]],
      areaSize: [unit?.areaSize, Validators.pattern(this.decimalsOnly)],
      id: [unit?.id]
    });
    return unitForm;
  }

  saleToFormGroup(sale?: Sale): FormGroup {
    const saleForm = this.fb.group({
      id: [sale?.id],
      status: [sale?.status || this.saleStatusChoices[0].value, this.saleStatusValidator()],
      statusDate: [sale?.statusDate],
      priceTarget: [sale?.priceTarget, Validators.pattern(this.decimalsOnly)],
      priceAchieved: [sale?.priceAchieved, Validators.pattern(this.decimalsOnly)],
      buyer: [sale?.buyer]
    });

    this.subs.push(
      saleForm.get('status')!.valueChanges.subscribe((value: string) => {
        if (value === 'available') {
          saleForm.get('statusDate')?.setValue(null);
        }
      })
    );

    return saleForm;
  }

  leaseToFormGroup(lease?: Lease): FormGroup {
    const leaseForm = this.fb.group({
      id: [lease?.id],
      unitId: [lease?.unitId],
      startDate: [lease?.startDate],
      endDate: [lease?.endDate],
      rentTarget: [lease?.rentTarget, Validators.pattern(this.decimalsOnly)],
      rentAchieved: [lease?.rentAchieved, Validators.pattern(this.decimalsOnly)],
      tenant: [lease?.tenant]
    });
    return leaseForm;
  }

  unitScheduleDataToFormGroup(assetClass: AssetClassType, unitScheduleData?: UnitScheduleData): FormGroup {
    if (assetClass.investmentStrategy === 'buildToRent') {
      return this.fb.group({
        unit: this.unitToFormGroup(unitScheduleData?.unit),
        lease: this.leaseToFormGroup(unitScheduleData?.lease)
      });
    } else {
      return this.fb.group({
        unit: this.unitToFormGroup(unitScheduleData?.unit),
        sale: this.saleToFormGroup(unitScheduleData?.sale)
      });
    }
  }

  onAddUnitScheduleData(unitScheduleData?: UnitScheduleData) {
    const unitScheduleDataForm = this.unitScheduleDataToFormGroup(this.assetClass, unitScheduleData);
    this.subs.push(unitScheduleDataForm.valueChanges.pipe(debounceTime(200)).subscribe(() => this.calculateTotals()));
    this.unitsScheduleFormArray.push(unitScheduleDataForm);
  }

  getUnitIdentifier(index: number): any {
    return this.unitsScheduleFormArray.at(index).get('unit')?.get('identifier')?.value;
  }

  getUnitLeaseStartDate(index: number): any {
    return this.unitsScheduleFormArray.at(index).get('lease')?.get('startDate')?.value;
  }

  FormGroupToUnit(form: FormGroup): Unit {
    const unit = {
      id: form.get('id')?.value,
      assetClassId: this.assetClass.id,
      label: this.unitStructure.label,
      identifier: form.get('identifier')?.value,
      description: form.get('description')?.value || '',
      beds: form.get('beds')?.value,
      areaSize: form.get('areaSize')?.value || 0.0,
      areaType: this.unitStructure.areaType,
      areaSystem: this.unitStructure.areaSystem
    };
    return unit;
  }

  FormGroupToSale(form: FormGroup, unit: Unit): Sale {
    const sale = {
      id: form.get('id')?.value,
      unitId: unit.id,
      status: form.get('status')?.value,
      statusDate: form.get('statusDate')?.value,
      priceTarget: form.get('priceTarget')?.value || 0.0,
      priceAchieved: form.get('priceAchieved')?.value || 0.0,
      buyer: form.get('buyer')?.value || ''
    };

    return sale;
  }

  FormGroupToLease(form: FormGroup, unit: Unit): Lease {
    const lease = {
      id: form.get('id')?.value,
      unitId: unit.id,
      tenant: form.get('tenant')?.value || '',
      rentTarget: form.get('rentTarget')?.value || 0.0,
      rentAchieved: form.get('rentAchieved')?.value || 0.0,
      rentFrequency: this.leaseStructure.rentFrequency,
      startDate: form.get('startDate')?.value,
      endDate: form.get('endDate')?.value
    };

    return lease;
  }

  formGroupToUnitScheduleData(unitScheduleDataFormGroup: FormGroup): UnitScheduleData {
    const unitForm = unitScheduleDataFormGroup.get('unit') as FormGroup;
    const unit = this.FormGroupToUnit(unitForm);
    let unitScheduleData = {} as UnitScheduleData;

    if (this.assetClass.investmentStrategy === 'buildToRent') {
      const leaseForm = unitScheduleDataFormGroup.get('lease') as FormGroup;
      const lease = this.FormGroupToLease(leaseForm, unit);
      unitScheduleData = {
        unit: unit,
        lease: lease
      };
    } else {
      const saleForm = unitScheduleDataFormGroup.get('sale') as FormGroup;
      const sale = this.FormGroupToSale(saleForm, unit);
      unitScheduleData = {
        unit: unit,
        sale: sale
      };
    }

    return unitScheduleData;
  }

  populateForm() {
    if (this.unitsScheduleData.length === 0) {
      this.onAddUnitScheduleData();
    }

    this.unitsScheduleData.forEach(unitScheduleData => {
      this.onAddUnitScheduleData(unitScheduleData);
    });

    this.calculateTotals();
  }

  onRemoveUnitScheduleData() {
    const unitId = this.unitsScheduleFormArray.at(this.index).get('unit.id')?.value;
    if (unitId) {
      const indexInUnitsScheduleData = this.unitsScheduleData.findIndex(
        unitScheduleData => unitScheduleData.unit.id === unitId
      );

      this.unitsToDelete.push(this.unitsScheduleData[indexInUnitsScheduleData].unit);
    }

    this.unitsScheduleFormArray.removeAt(this.index);
    this.mode = 'edit';
  }

  onConfirmDelete(index: number) {
    this.mode = 'delete';
    this.index = index;
  }

  onCancelDelete() {
    this.mode = 'edit';
  }

  onSave() {
    if (!this.form.valid) {
      return;
    }

    const unitsScheduleData: UnitScheduleData[] = this.unitsScheduleFormArray.controls.map(
      (control: AbstractControl) => {
        const unitScheduleDataFormGroup = control as FormGroup;
        return this.formGroupToUnitScheduleData(unitScheduleDataFormGroup);
      }
    );

    if (this.unitsToDelete.length > 0) {
      this.deleteUnits(this.unitsToDelete);
    }

    if (this.assetClass.investmentStrategy === 'buildToSell') {
      this._unitService
        .updateOrCreateUnitsScheduleBTS(unitsScheduleData)
        .subscribe((unitScheduleDataRes: UnitScheduleData[]) => {
          this.modalSaveUnitsSchedule.emit(unitScheduleDataRes);
          this.setAssetClassDataSub(this.assetClass, unitScheduleDataRes);
        });
    } else {
      this._unitService
        .updateOrCreateUnitsScheduleBTR(unitsScheduleData)
        .subscribe((unitScheduleDataRes: UnitScheduleData[]) => {
          this.modalSaveUnitsSchedule.emit(unitScheduleDataRes);
          this.setAssetClassDataSub(this.assetClass, unitScheduleDataRes);
        });
    }
  }

  setAssetClassDataSub(assetClass: AssetClassType, UnitScheduleData: UnitScheduleData[]) {
    const units: Unit[] = UnitScheduleData.map(unitScheduleData => unitScheduleData.unit);

    const assetClassData = {
      assetClass: assetClass,
      units: units
    };

    this._schemeService.setAssetClassDataSub(assetClassData);
  }

  deleteUnits(units: Unit[]) {
    this._unitService.deleteUnits(units).subscribe();
  }

  getFormArrayErrorMessages(formArray: FormArray, formGroupName: string): string[] {
    const errorMessages: string[] = [];

    for (const control of formArray.controls) {
      const formGroup = control as FormGroup;
      const nestedFormGroup = formGroup.get(formGroupName) as FormGroup;

      for (const controlName in nestedFormGroup.controls) {
        // if (this.step === 1 && !controlsUnit.includes(controlName) || this.step === 2 && !controlsSaleAndLease.includes(controlName)) {
        //   continue;
        // };

        const controlInstance = nestedFormGroup.get(controlName);
        const errorType = controlInstance?.errors ? Object.keys(controlInstance.errors)[0] : null;

        if (errorType) {
          const message = this.validationMessages[formGroupName][controlName][errorType];
          if (!errorMessages.includes(message)) {
            errorMessages.push(message);
          }
        }
      }
    }
    return errorMessages;
  }

  compareFn(satus1: string, satus2: string): boolean {
    return satus1 === satus2;
  }

  areAllUnitsFormsValid(): boolean {
    return this.unitsScheduleFormArray.controls.every(control => {
      const unitFormGroup = (control as FormGroup).get('unit') as FormGroup;
      return unitFormGroup.valid;
    });
  }

  onNext() {
    this.nextIsClicked = true;

    if (this.form.valid) {
      this.nextIsClicked = false;
      this.step++;
      this.updateStatus();
    }
  }

  onPrevious() {
    this.nextIsClicked = false;
    this.step--;
    this.updateStatus();
  }

  updateStatus() {
    if (this.step === 1) {
      this.unitsStatus = 'active';
      this.salesStatus = 'inactive';
      this.lettingsStatus = 'inactive';
    } else {
      this.unitsStatus = 'complete';
      this.salesStatus = 'active';
      this.lettingsStatus = 'active';
    }
  }

  uniqueValueValidator(formGroupName: string, controlName: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (!(control instanceof FormControl)) {
        return null;
      }

      const currentControl = control;

      const duplicateControl = this.unitsScheduleFormArray.controls.find((control: AbstractControl) => {
        const formGroup = control as FormGroup;
        const nestedFormGroup = formGroup.get(formGroupName) as FormGroup;
        const formControl = nestedFormGroup.get(controlName) as FormControl;

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

        if (status === 'available' && priceAchieved === 0) {
          return {statusPriceError: true}; // Returning custom error object
        }
      }

      return null; // If validation passed, return null
    };
  }

  // if units has beds, then beds must be greater than 0
  atLeastOneValditor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (this.unitStructure.hasBeds) {
        return null;
      }

      return !value || value === 0 ? {atLeastOne: true} : null;
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  getFormValue(formArray: FormArray, index: number, ...path: string[]): string | number {
    const value = formArray.at(index).get(path.join('.'))?.value;
    return value || 'not defined';
  }

  getRentFrequencyLabel(rentFrequencyValue: string): string {
    const rentFrequencyChoice = this.rentFrequencyChoices.find(choice => choice.value === rentFrequencyValue);
    return rentFrequencyChoice ? rentFrequencyChoice.label : 'not defined';
  }

  reset(FormGroupName: string, index: number) {
    const formGroup = this.unitsScheduleFormArray.at(index).get(FormGroupName) as FormGroup;
    formGroup.reset();
  }

  hasSale(control: AbstractControl): true | null {
    const unitScheduleData = control as FormGroup;
    return unitScheduleData.get('sale.priceAchieved')?.value ? null : true;
  }
}
