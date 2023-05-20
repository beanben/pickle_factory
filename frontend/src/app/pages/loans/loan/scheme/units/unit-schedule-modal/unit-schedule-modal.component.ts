import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {SchemeService} from 'src/app/_services/scheme/scheme.service';
import {
  AbstractControl,
  Form,
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
  [category: string]: {
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
  totalSalePriceTarget = 0.00;
  totalSalePriceAchieved = 0.00;
  averageLeaseRentTarget = 0.00;
  averageLeaseRentAchieved = 0.00;
  unitsToDelete: Unit[] = [];
  rentFrequencyLabel = '';
  leaseFrequencyLabel = '';
  index = -1;

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


  unitsFormGroup: FormGroup = this.fb.group({
    unitsData: this.fb.array([])
  });
  salesFormGroup: FormGroup = this.fb.group({
    salesData: this.fb.array([])
  });
  leasesFormGroup: FormGroup = this.fb.group({
    leasesData: this.fb.array([])
  });

  get unitsFormArray(): FormArray {
    return this.unitsFormGroup.get('unitsData') as FormArray;
  }
  get salesFormArray(): FormArray {
    return this.salesFormGroup.get('salesData') as FormArray;
  }
  get leasesFormArray(): FormArray {
    return this.leasesFormGroup.get('leasesData') as FormArray;
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
        pattern: 'Sale price target must be a valid number'
      },
      priceAchieved: {
        pattern: 'Sale price achieved must be a valid number'
      },
      status: {
        statusPriceError: 'Status cannot be available if price achieved is above 0'
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


  constructor(
    private el: ElementRef,
    private _schemeService: SchemeService,
    private _unitService: UnitService,
    private fb: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.addEventBackgroundClose();
    this.calculateUnitsTotals();
    this.calculateSalesTotals();
    this.calculateLeasesTotals();
    this.populateUnitsFormArray();
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

  calculateUnitsTotals() {
    this.totalUnits = this.unitsFormArray.length;
    this.totalAreaSize = this.calculateTotalForFormArray(this.unitsFormArray, 'areaSize', 2);
    this.totalBeds = this.calculateTotalForFormArray(this.unitsFormArray, 'beds');
  }
  calculateSalesTotals() {
    this.totalSalePriceTarget = this.calculateTotalForFormArray(this.salesFormArray, 'priceTarget', 2);
    this.totalSalePriceAchieved = this.calculateTotalForFormArray(this.salesFormArray, 'priceAchieved', 2);
  }
  calculateLeasesTotals() {
    this.averageLeaseRentTarget = this.calculateAverageFromFormArray(this.leasesFormArray, 'rentTargetAmount', 2);
    this.averageLeaseRentAchieved = this.calculateAverageFromFormArray(this.leasesFormArray, 'rentAchievedAmount', 2);
  }


  calculateTotalForFormArray(formArray: FormArray, controlName: string, decimalPrecision = 0): number {
    return formArray.controls
      .map(control => control.get(controlName)?.value || 0)
      .reduce((sum, currentValue) => sum + Number(currentValue), 0)
      .toFixed(decimalPrecision);
  }


  calculateAverageFromFormArray(formArray: FormArray, controlName: string, decimalPrecision = 0): number {
    const total = this.calculateTotalForFormArray(formArray, controlName, decimalPrecision);
    return this.totalUnits === 0 ? 0 : +(total / this.totalUnits).toFixed(decimalPrecision);
  }


  populateUnitsFormArray() {
    const units: Unit[] = this.unitsScheduleData.map(unitScheduleData => unitScheduleData.unit);

    if(units.length === 0) {
      this.onAddUnit();
    } else {
      units.forEach(unit => {
        this.onAddUnit(unit);
      });
    }

    
  }

  onAddUnit(unit?: Unit) {
    const unitForm = this.unitToFormGroup(unit);
    this.unitsFormArray.push(unitForm);
  }

  unitToFormGroup(unit?: Unit): FormGroup {
    const unitForm = this.fb.group({
      identifier: [
        unit?.identifier,
        [Validators.required, this.uniqueValueValidator(this.unitsFormArray, 'identifier')]
      ],
      description: [unit?.description, Validators.required],
      beds: [unit?.beds, [Validators.pattern(this.numbersOnly), this.atLeastOneValditor()]],
      areaSize: [unit?.areaSize, Validators.pattern(this.decimalsOnly)],
      id: [unit?.id]
    });
    return unitForm;
  }

  populateSalesFormArray() {
    const sales: (Sale | undefined)[] = this.unitsScheduleData.map(unitScheduleData => unitScheduleData.sale).flat();

    this.unitsFormArray.controls.forEach((unitForm, index) => {
      const unit: Unit = this.FormGroupToUnit(unitForm as FormGroup);
      const sale = sales.find(sale => sale?.unitId === unit.id);

      if (sale) {
        this.onAddSale(index, sale);
      } else {
        this.onAddSale(index);
      }
    });

  }

  onAddSale(index: number, sale?: Sale) {
    const unitIdentifier = this.unitsFormArray.at(index).get('identifier')!.value;

    if (this.salesFormArray.length >= index + 1) {
      const saleForm = this.salesFormArray.at(index) as FormGroup;
      this.salesFormArray.setControl(index, saleForm);
    } else {
      const saleForm: FormGroup = this.saleToFormGroup(unitIdentifier, sale);
      this.salesFormArray.push(saleForm);
    }

  }

  saleToFormGroup(unitIdentifier: string, sale?: Sale): FormGroup {
    const saleForm = this.fb.group({
      id: [sale?.id],
      unitIdentifier: [unitIdentifier],
      status: [sale?.status || this.saleStatusChoices[0].value, this.saleStatusValidator()],
      statusDate: [sale?.statusDate],
      priceTarget: [sale?.priceTarget || 0.0, Validators.pattern(this.decimalsOnly)],
      priceAchieved: [sale?.priceAchieved || 0.0, Validators.pattern(this.decimalsOnly)],
      buyer: [sale?.buyer]
    });

    this.subs.push(
      saleForm.get('status')!.valueChanges.subscribe((value: string) => {
        if (value === 'available') {
          saleForm.get('statusDate')?.setValue(null);
        }
      }),
      saleForm.get('priceAchieved')!.valueChanges.subscribe(() => {
        saleForm.get('status')!.updateValueAndValidity();
      })
    );

    return saleForm;
  }

  populateLeasesFormArray() {
    const leases: (Lease | undefined)[] = this.unitsScheduleData.map(unitScheduleData => unitScheduleData.lease).flat();

    this.unitsFormArray.controls.forEach((unitForm, index) => {
      const unit: Unit = this.FormGroupToUnit(unitForm as FormGroup);
      const lease = leases.find(lease => lease?.unitId === unit.id);

      if (lease) {
        this.onAddLease(index, lease);
      } else {
        this.onAddLease(index);
      }
    });


  }


  onAddLease(index: number, lease?: Lease) {
    const unitIdentifier = this.unitsFormArray.at(index).get('identifier')!.value;

    if (this.leasesFormArray.length >= index + 1) {
      const leaseForm = this.leasesFormArray.at(index) as FormGroup;
      this.leasesFormArray.setControl(index, leaseForm);
    } else {
      const leaseForm = this.leaseToFormGroup(unitIdentifier, lease);
      this.leasesFormArray.push(leaseForm);
    }
  }

  leaseToFormGroup(unitIdentifier: string, lease?: Lease): FormGroup {
    const leaseForm = this.fb.group({
      id: [lease?.id],
      unitIdentifier: [unitIdentifier],
      startDate: [lease?.startDate],
      endDate: [lease?.endDate],
      rentTarget: [lease?.rentTarget, Validators.pattern(this.decimalsOnly)],
      rentAchieved: [lease?.rentAchieved, Validators.pattern(this.decimalsOnly)],
      tenant: [lease?.tenant]
    });
    return leaseForm;
  }


  getUnitIdentifier(index: number): any {
    return this.unitsFormArray.at(index).get('identifier')?.value;
  }

  getUnitLeaseStartDate(index: number): any {
    return this.leasesFormArray.at(index).get('startDate')?.value;
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

  updateOrCreateUnitsScheduleBTS() {
    const unitsScheduleDataBTS: UnitScheduleData[] = this.combineUnitAndSaleForms();

    this._unitService
      .updateOrCreateUnitsScheduleBTS(unitsScheduleDataBTS)
      .subscribe((unitScheduleDataRes: UnitScheduleData[]) => {
        this.modalSaveUnitsSchedule.emit(unitScheduleDataRes);
        this.setAssetClassDataSub(this.assetClass, unitScheduleDataRes);
      });
  }

  combineUnitAndSaleForms(): UnitScheduleData[] {
    const unitsScheduleDataBTS: UnitScheduleData[] = [];

    this.unitsFormArray.controls.forEach((unitForm, index) => {
      const unit = this.FormGroupToUnit(unitForm as FormGroup);
      const saleForm = this.salesFormArray.at(index) as FormGroup;
      const sale = this.FormGroupToSale(saleForm, unit);
      const unitScheduleData = {
        unit: unit,
        sale: sale
      };
      unitsScheduleDataBTS.push(unitScheduleData);
    });
    return unitsScheduleDataBTS;
  }

  updateOrCreateUnitsScheduleBTR() {
    const unitsScheduleDataBTR: UnitScheduleData[] = this.combineUnitAndLeaseForms();

    this._unitService
      .updateOrCreateUnitsScheduleBTR(unitsScheduleDataBTR)
      .subscribe((unitScheduleDataRes: UnitScheduleData[]) => {
        this.modalSaveUnitsSchedule.emit(unitScheduleDataRes);
        this.setAssetClassDataSub(this.assetClass, unitScheduleDataRes);
      });
  }

  combineUnitAndLeaseForms(): UnitScheduleData[] {
    const unitsScheduleDataBTR: UnitScheduleData[] = [];
    this.unitsFormArray.controls.forEach((unitForm, index) => {
      const unit = this.FormGroupToUnit(unitForm as FormGroup);
      const leaseForm = this.leasesFormArray.at(index) as FormGroup;
      const lease = this.FormGroupToLease(leaseForm, unit);
      const unitScheduleData = {
        unit: unit,
        lease: lease
      };
      unitsScheduleDataBTR.push(unitScheduleData);
    });
    return unitsScheduleDataBTR;
  }



  onRemoveUnit(index: number) {
    const unitId = this.unitsFormArray.at(index).get('id')?.value;
    if (unitId) {
      const indexInUnitsScheduleData = this.unitsScheduleData.findIndex(
        unitScheduleData => unitScheduleData.unit.id === unitId
      );

      this.unitsToDelete.push(this.unitsScheduleData[indexInUnitsScheduleData].unit);
    }

    this.unitsFormArray.removeAt(index);

    if (this.leasesFormArray.length >= index) {
      this.leasesFormArray.removeAt(index);
    }

    if (this.salesFormArray.length >= index) {
      this.salesFormArray.removeAt(index);
    }

    this.mode = 'edit';

    if(this.unitsFormArray.length === 0) {
      this.onSave();
    }
  }

  onConfirmDelete(index: number) {
    this.mode = 'delete';
    this.index = index;
  }

  onCancelDelete() {
    this.mode = 'edit';
  }

  onSave() {
    if (this.salesFormGroup.invalid || this.unitsFormGroup.invalid || this.leasesFormGroup.invalid) {
      this.printFormsErrors();
      return;
    }

    if (this.unitsToDelete.length > 0) {
      this.deleteUnits(this.unitsToDelete);
    }

    if (this.assetClass.investmentStrategy === 'buildToSell') {
      this.updateOrCreateUnitsScheduleBTS();
    } else {
      this.updateOrCreateUnitsScheduleBTR();
    }
  }

  printFormsErrors() {
    if (this.salesFormGroup.invalid) {
      this.printFormArrayErrors(this.salesFormArray);
    }

    if (this.unitsFormGroup.invalid) {
      this.printFormArrayErrors(this.unitsFormArray);
    }

    if (this.leasesFormGroup.invalid) {
      this.printFormArrayErrors(this.leasesFormArray);
    }
  }

  printFormArrayErrors(formArray: FormArray) {
    for (let i = 0; i < formArray.length; i++) {
      const formGroup: FormGroup = formArray.at(i) as FormGroup;

      Object.keys(formGroup.controls).forEach(key => {
        const control = formGroup.get(key);
        const controlErrors: ValidationErrors | null = control ? control.errors : null;
        if (controlErrors) {
          console.log('Key control: ' + key + ', err value: ', controlErrors);
        }
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



  getFormArrayErrorMessages(formArray: FormArray, category: string): string[] {
    const errorMessages: string[] = [];

    for (const control of formArray.controls) {
      const formGroup = control as FormGroup;

      for (const controlName in formGroup.controls) {
        const controlInstance = formGroup.get(controlName);
        const errorType = controlInstance?.errors ? Object.keys(controlInstance.errors)[0] : null;

        if (errorType) {
          const message = this.validationMessages[category][controlName][errorType];
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


  onNext() {
    this.nextIsClicked = true;

    if (this.unitsFormGroup.valid) {
      if (this.assetClass.investmentStrategy === 'buildToSell') {
        this.populateSalesFormArray();
      } else {
        this.populateLeasesFormArray();
      }

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
        
        if (status === 'available' && priceAchieved > 0) {
          console.log('status: ', status, 'priceAchieved: ', priceAchieved);

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

      if (!this.unitStructure.hasBeds) {
        return null;
      }

      return !value || value === 0 ? {atLeastOne: true} : null;
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }



  getFormValue(formArray: FormArray, index: number, controlName: string) {
    const value = formArray.at(index).get(controlName)?.value;
    return value || 'not defined';
  }

  getRentFrequencyLabel(rentFrequencyValue: string): string {
    const rentFrequencyChoice = this.rentFrequencyChoices.find(choice => choice.value === rentFrequencyValue);
    return rentFrequencyChoice ? rentFrequencyChoice.label : 'not defined';
  }


  reset(formArray: FormArray, index: number) {
    const formGroup = formArray.at(index) as FormGroup;
    formGroup.reset();
  }


  salesAchieved(index: number): boolean {
    const formGroup = this.salesFormArray.at(index) as FormGroup;
    const priceAchieved = formGroup.get('priceAchieved')?.value || 0;
    return priceAchieved > 0;
  }

  rentAchieved(index: number): boolean {
    const formGroup = this.leasesFormArray.at(index) as FormGroup;
    const rentAchieved = formGroup.get('rentAchieved')?.value || 0;
    return rentAchieved > 0;
  }
}
