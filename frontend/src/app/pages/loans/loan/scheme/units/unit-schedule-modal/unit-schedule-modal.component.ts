import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Scheme, UnitScheduleData } from '../../scheme';
import { AssetClassType, Lease, Sale, Unit } from '../../scheme.model';
import { Choice } from 'src/app/shared/shared';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toCamelCase } from 'src/app/shared/utils';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subscription, lastValueFrom } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { APIResult } from 'src/app/_services/api-result';

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
  styleUrls: ['./unit-schedule-modal.component.css'],
})
export class UnitScheduleModalComponent implements OnInit, OnChanges, OnDestroy {
  displayStyle = 'block';
  @Input() mode = '';
  @Input() unitsScheduleData: UnitScheduleData[] = [];
  // @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit;
  leaseStructure = {} as Lease;
  @Output() modalSaveUnitsSchedule = new EventEmitter<UnitScheduleData[] | null>();
  saleStatusChoices: Choice[] = [];
  rentFrequencyChoices: Choice[] = [];
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

  form: FormGroup = this.fb.group({
    unitsScheduleData: this.fb.array([]),
  });

  validationMessages: ValidationMessages = {
    unit: {
      identifier: {
        required: 'Identifier is required',
        uniqueValue: 'Identifier must be unique',
      },
      description: {
        required: 'Description is required',
      },
      areaSize: {
        pattern: 'Area must be a valid number',
      },
      beds: {
        pattern: 'Number of beds must be a valid number',
        atLeastOne: 'At least one bed is required',
      },
    },
    sale: {
      priceTarget: {
        pattern: 'Sale price target must be a valid number',
      },
      priceAchieved: {
        pattern: 'Sale price achieved must be a valid number',
      },
    },
    lease: {
      rentTarget: {
        pattern: 'Rent target must be a valid number',
      },
      rentAchieved: {
        pattern: 'Rent achieved must be a valid number',
      },
    },
  };
  // validationMessages: ValidationMessages = {
  //   identifier: {
  //     required: 'Identifier is required',
  //     uniqueValue: 'Identifier must be unique',
  //   },
  //   description: {
  //     required: 'Description is required',
  //   },
  //   areaSize: {
  //     pattern: 'Area must be a valid number',
  //   },
  //   beds: {
  //     pattern: 'Number of beds must be a valid number',
  //   },
  //   salePrice: {
  //     pattern: 'Sale price must be a valid number',
  //   },
  //   leaseRent: {
  //     pattern: 'Rent must be a valid number',
  //   },
  // };

  get unitsScheduleFormArray(): FormArray {
    return this.form.get('unitsScheduleData') as FormArray;
  }

  constructor(private el: ElementRef, private _schemeService: SchemeService, private fb: FormBuilder) {}

  async ngOnInit(): Promise<void> {
    this.addEventBackgroundClose();
    await this.getChoices('saleStatus', this.saleStatusChoices);
    await this.getChoices('rentFrequency', this.rentFrequencyChoices);
    await this.getChoices('leaseFrequency', this.leaseFrequencyChoices);

    // if (this.mode === 'edit') {
    this.populateForm();
    // };
    // this.leaseFrequency = this.rentFrequencyChoices[this.leaseStructure.leaseFrequency].label
    this.onAssetClassChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass'] && changes['assetClass'].currentValue) {
      this.onAssetClassChange();
      // this.unitStructure = new Unit(this.assetClass);
      // this.leaseStructure = new Lease(this.unitStructure);
      // this.rentFrequencyLabel = this.defineRentFrequency();
      // this.leaseFrequencyLabel = this.defineLeaseFrequency();
      // this.calculateTotals();
    }
  }

  onAssetClassChange(): void {
    this.unitStructure = new Unit(this.assetClass);
    this.leaseStructure = new Lease(this.unitStructure);
    this.rentFrequencyLabel = this.defineRentFrequency();
    this.leaseFrequencyLabel = this.defineLeaseFrequency();
    this.calculateTotals();
  }

  defineRentFrequency(): string {
    const frequencyChoiceValue: string = this.leaseStructure.rentFrequency;
    const choice = this.rentFrequencyChoices.find((item: Choice) => item.value === frequencyChoiceValue);
    return choice ? choice.label : '';
  }

  defineLeaseFrequency(): string {
    const frequencyChoiceValue: string = this.leaseStructure.leaseFrequency;
    const choice = this.leaseFrequencyChoices.find((item: Choice) => item.value === frequencyChoiceValue);
    return choice ? choice.label : '';
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

  // getSaleStatusChoices(): void {
  //   this._schemeService.getSaleStatusChoices().subscribe(choices => {

  //     this.saleStatusChoices = choices.map((choice: Choice) => {
  //       return {
  //         value: choice.value,
  //         label: choice.label
  //       }
  //     });

  //   });
  // }

  // getChoices(choiceType: string) {
  //   this._schemeService.getChoices(choiceType)
  //     .subscribe((choices: Choice[]) => {
  //       this.saleStatusChoices = choices;
  //       console.log(choices)
  //       // async and await and set the value of the form control
  //     })
  // }

  async getChoices(choiceType: string, targetArray: Choice[]): Promise<void> {
    const choices$ = this._schemeService.getChoices(choiceType);
    const choices: Choice[] = await lastValueFrom(choices$);

    targetArray.push(...choices);
  }

  calculateTotals() {
    this.totalUnits = this.unitsScheduleFormArray.length;

    this.totalAreaSize = this.calculateTotalForFormControl('unit', 'areaSize', 2);
    this.totalBeds = this.calculateTotalForFormControl('unit', 'beds');
    this.totalSalePriceTarget = this.calculateTotalForFormControl('sale', 'priceTarget', 2);
    this.totalSalePriceAchieved = this.calculateTotalForFormControl('sale', 'priceAchieved', 2);

    this.averageLeaseRentTarget = this.calculateAverageFromFormControls('lease', 'rentTargetAmount', 2);
    this.averageLeaseRentAchieved = this.calculateAverageFromFormControls('lease', 'rentAchievedAmount', 2);
  }

  calculateTotalForFormControl(formGroupName: string, controlName: string, decimalPrecision = 0): number {
    return this.unitsScheduleFormArray.controls
      .map((control) => control.get(formGroupName)?.get(controlName)?.value || 0)
      .reduce((sum, currentValue) => sum + Number(currentValue), 0)
      .toFixed(decimalPrecision);
  }

  calculateAverageFromFormControls(formGroupName: string, controlName: string, decimalPrecision = 0): number {
    const total = this.calculateTotalForFormControl(formGroupName, controlName, decimalPrecision);
    return this.totalUnits === 0 ? 0 : +(total / this.totalUnits).toFixed(decimalPrecision);
  }

  unitToFormGroup(unit: Unit): FormGroup {
    const unitForm = this.fb.group({
      identifier: [unit.identifier, [Validators.required, this.uniqueValueValidator('unit', 'identifier')]],
      description: [unit.description, Validators.required],
      beds: [unit.beds, [Validators.pattern(this.numbersOnly), this.atLeastOneValditor()]],
      areaSize: [unit.areaSize, Validators.pattern(this.decimalsOnly)],
      id: [unit.id],
    });
    return unitForm;
  }

  saleToFormGroup(sale: Sale): FormGroup {
    const saleForm = this.fb.group({
      id: [sale.id],
      status: [sale.status || this.saleStatusChoices[0].value],
      statusDate: [sale.statusDate],
      priceTarget: [sale.priceTarget, Validators.pattern(this.decimalsOnly)],
      priceAchieved: [sale.priceAchieved, Validators.pattern(this.decimalsOnly)],
      buyer: [sale?.buyer],
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

  leaseToFormGroup(lease: Lease): FormGroup {
    const leaseForm = this.fb.group({
      id: [lease.id],
      unitId: [lease.unit?.id],
      startDate: [lease.startDate],
      term: [lease.term, Validators.pattern(this.numbersOnly)],
      rentTarget: [lease.rentTarget, Validators.pattern(this.decimalsOnly)],
      rentAchieved: [lease.rentAchieved, Validators.pattern(this.decimalsOnly)],
      tenant: [lease.tenant],
    });
    return leaseForm;
  }

  unitScheduleDataToFormGroup(unitScheduleData: UnitScheduleData): FormGroup {
    return this.fb.group({
      unit: this.unitToFormGroup(unitScheduleData.unit),
      sale: this.saleToFormGroup(unitScheduleData.sale),
      lease: this.leaseToFormGroup(unitScheduleData.lease),
    });
  }

  onAddUnitScheduleData(unitScheduleData?: UnitScheduleData) {
    const newUnit = new Unit(this.assetClass);
    let unitScheduleDataAdjusted = unitScheduleData ?? {
      unit: newUnit,
      sale: new Sale(newUnit),
      lease: new Lease(newUnit),
    };

    const unitScheduleDataForm = this.unitScheduleDataToFormGroup(unitScheduleDataAdjusted);
    // const unitForm = this.unitToFormGroup(unitToAdd);

    this.subs.push(unitScheduleDataForm.valueChanges.pipe(debounceTime(200)).subscribe(() => this.calculateTotals()));

    this.unitsScheduleFormArray.push(unitScheduleDataForm);
  }

  getUnitIdentifier(index: number): any {
    return this.unitsScheduleFormArray.at(index).get('unit')?.get('identifier')?.value;
  }

  FormGroupToUnit(form: FormGroup): Unit {
    const unit = new Unit(this.assetClass);
    unit.id = form.get('id')?.value;
    unit.identifier = form.get('identifier')?.value;
    unit.description = form.get('description')?.value;
    unit.areaSize = form.get('areaSize')?.value;
    unit.beds = form.get('beds')?.value;

    return unit;
  }

  FormGroupToSale(form: FormGroup, unit: Unit): Sale {
    const sale = new Sale(unit);
    sale.id = form.get('id')?.value;
    sale.status = form.get('status')?.value;
    sale.statusDate = form.get('statusDate')?.value;
    sale.priceTarget = form.get('priceTarget')?.value;
    sale.priceAchieved = form.get('priceAchieved')?.value;
    sale.buyer = form.get('buyer')?.value;

    return sale;
  }

  FormGroupToLease(form: FormGroup, unit: Unit): Lease {
    const lease = new Lease(unit);
    lease.id = form.get('id')?.value;
    lease.tenant = form.get('tenant')?.value;
    lease.rentTarget = form.get('rentTarget')?.value;
    lease.rentAchieved = form.get('rentAchieved')?.value;
    lease.startDate = form.get('startDate')?.value;
    lease.term = form.get('term')?.value;

    return lease;
  }

  formGroupToUnitScheduleData(unitScheduleDataFormGroup: FormGroup): UnitScheduleData {
    // Extract the unit, sale, and lease form groups
    const unitForm = unitScheduleDataFormGroup.get('unit') as FormGroup;
    const saleForm = unitScheduleDataFormGroup.get('sale') as FormGroup;
    const leaseForm = unitScheduleDataFormGroup.get('lease') as FormGroup;

    // Convert form groups to instances
    const unit = this.FormGroupToUnit(unitForm);
    const sale = this.FormGroupToSale(saleForm, unit);
    const lease = this.FormGroupToLease(leaseForm, unit);

    // Create a UnitScheduleData object with the instances
    const unitScheduleData: UnitScheduleData = {
      unit: unit,
      sale: sale,
      lease: lease,
    };

    return unitScheduleData;
  }

  populateForm() {
    if (this.unitsScheduleData.length === 0) {
      this.onAddUnitScheduleData();
    }

    this.unitsScheduleData.forEach((unitScheduleData) => {
      this.onAddUnitScheduleData(unitScheduleData);
    });

    this.calculateTotals();
  }

  onRemoveUnitScheduleData() {
    const unitId = this.unitsScheduleFormArray.at(this.index).get('unit.id')?.value;
    if (unitId) {
      const indexInUnitsScheduleData = this.unitsScheduleData.findIndex(
        (unitScheduleData) => unitScheduleData.unit.id === unitId
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

    // console.log("unitsScheduleData", unitsScheduleData);

    this._schemeService.updateOrCreateUnitsScheduleData(unitsScheduleData)
      .subscribe((unitScheduleDataRes: UnitScheduleData[]) => {

        console.log("unitScheduleDataRes", unitScheduleDataRes);
    //   });
    //   this._schemeService.updateOrCreateUnits(units)
    //     .subscribe((unitRes: Unit[]) => {
    //       // this.assetClass.units = unitRes;
    //       this.modalSaveUnitSchedule.emit(unitRes)
    //       console.log("unitRes", unitRes);
        });
  }

  deleteUnits(units: Unit[]) {
    this._schemeService.deleteUnits(units).subscribe();
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

  // getFormArrayErrorMessages(formArray: FormArray): string[] {
  //   const errorMessages: string[] = [];
  //   const controlsUnit = ['identifier', 'description', 'areaSize', 'beds'];
  //   const controlsSaleAndLease = ['salePriceTarget', 'salePriceAchieved', 'saleStatus', 'saleStatusDate', 'saleBuyer', 'leaseRentAmount', 'leaseStartDate', 'leaseDuration', 'leaseTenant'];

  //   for (const control of formArray.controls) {
  //     const formGroup = control as FormGroup;

  //     for (const controlName in formGroup.controls) {

  //       if (this.step === 1 && !controlsUnit.includes(controlName) || this.step === 2 && !controlsSaleAndLease.includes(controlName)) {
  //         continue;
  //       };

  //       const controlInstance = formGroup.get(controlName);
  //       const errorType = controlInstance?.errors ? Object.keys(controlInstance.errors)[0] : null;

  //       if (errorType) {
  //         const message = this.validationMessages[controlName][errorType];
  //         if (!errorMessages.includes(message)) {
  //           errorMessages.push(message);
  //         }
  //       }
  //     }
  //   }
  //   return errorMessages;
  // }

  compareFn(satus1: string, satus2: string): boolean {
    return satus1 === satus2;
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

      return duplicateControl ? { uniqueValue: true } : null;
    };
  }

  // if units has beds, then beds must be greater than 0
  atLeastOneValditor(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!this.unitStructure.hasBeds()) {
        return null;
      }

      return !value || value === 0 ? { atLeastOne: true } : null;
    };
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  getFormValue(formArray: FormArray, index: number, ...path: string[]): string | number {
    const value = formArray.at(index).get(path.join('.'))?.value;
    return value || 'not defined';
  }
}
