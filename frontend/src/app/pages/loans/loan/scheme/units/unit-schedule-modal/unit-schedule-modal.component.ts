import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';
import { Choice } from 'src/app/shared/shared';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toCamelCase } from 'src/app/shared/utils';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { APIResult } from 'src/app/_services/api-result';

interface ValidationMessages {
  [controlName: string]: {
    [errorType: string]: string;
  };
}

@Component({
  selector: 'app-unit-schedule-modal',
  templateUrl: './unit-schedule-modal.component.html',
  styleUrls: ['./unit-schedule-modal.component.css']
})
export class UnitScheduleModalComponent implements OnInit, OnChanges, OnDestroy {
  // displayStyle = "block";
  // @Input() mode = "";
  // @Input() scheme = {} as Scheme;
  // @Input() assetClass = {} as AssetClassType;
  // unitStructure = {} as Unit;
  // @Output() modalSaveUnitSchedule = new EventEmitter<Unit[] | null>();
  // saleStatusChoices: Choice[] = [];
  // totalUnits = 0;
  // totalAreaSize = 0;
  // totalBeds = 0;
  // totalSalePriceTarget = 0;
  // totalSalePriceAchieved = 0;
  // averageLeaseRentTarget = 0;
  // averageLeaseRentAchieved = 0;
  // unitsToDelete: Unit[] = [];
  // rentFrequency: 'weekly' | 'monthly' = 'weekly';
  // leaseFrequency: 'weeks' | 'months' = 'weeks';
  // index = 0;
  // unitSelected = {} as Unit;
  // numbersOnly = /^\d+$/;
  // decimalsOnly = /^\d*\.?\d*$/;
  // step = 1;
  // chevronRight = "assets/images/chevronRight.svg";
  // unitsStatus = "active";
  // salesStatus = "inactive";
  // lettingsStatus = "inactive";
  // nextIsClicked = false;
  subs: Subscription[] = [];

  // form: FormGroup = this.fb.group({
  //   units: this.fb.array([])
  // });

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

  // get units(): FormArray {
  //   return this.form.get('units') as FormArray;
  // }

  // constructor(
  //   private el: ElementRef,
  //   private _schemeService: SchemeService,
  //   private fb: FormBuilder
  // ) { }

  ngOnInit(): void {
    // this.addEventBackgroundClose();
    // this.getSaleStatusChoices();

    // if (this.mode === 'edit') {
    //   this.populateForm();
    // };

    // this.rentFrequency = this.defineRentFrequency();
    // this.leaseFrequency = this.defineLeaseFrequency();
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass']) {
      // this.unitStructure = new Unit(this.assetClass);
      // this.calculateUnitTotals();
    }
  }

  // addEventBackgroundClose() {
  //   this.el.nativeElement.addEventListener('click', (el: any) => {
  //     if (el.target.className === 'modal') {
  //       this.onCancel();
  //     }
  //   });
  // };

  // onCancel() {
  //   this.modalSaveUnitSchedule.emit();
  // }

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

  // calculateUnitTotals() {
  //   this.totalUnits = this.assetClass.units?.length ?? 0;

  //   this.totalAreaSize = this.calculateTotalForFormControl('areaSize', 2);
  //   console.log("totalAreaSize: ", this.totalAreaSize);
  //   this.totalBeds = this.calculateTotalForFormControl('beds');
  //   this.totalSalePriceTarget = this.calculateTotalForFormControl('salePriceTarget', 2);
  //   this.totalSalePriceAchieved = this.calculateTotalForFormControl('salePriceAchieved', 2);

  //   this.averageLeaseRentTarget = this.calculateAverageFromFormControls('leaseRentTargetAmount', 2);
  //   this.averageLeaseRentAchieved = this.calculateAverageFromFormControls('leaseRentAchievedAmount', 2);
  // }

  // calculateTotalForFormControl(controlName: string, decimalPrecision = 0): number {
  //   return this.units.controls
  //     .map(control => control.get(controlName)?.value || 0)
  //     .reduce((sum, currentValue) => sum + Number(currentValue), 0)
  //     .toFixed(decimalPrecision);
  // }

  // calculateAverageFromFormControls(controlName: string, decimalPrecision = 0): number {
  //   const total = this.calculateTotalForFormControl(controlName, decimalPrecision);
  //   return this.totalUnits === 0 ? 0 : +(total / this.totalUnits).toFixed(decimalPrecision);
  // }


  // unitToFormGroup(unit: Unit): FormGroup {
  //   return this.fb.group({
  //     id: [unit.id],

  //     identifier: [unit.identifier, [Validators.required, this.uniqueValueValidator('identifier')]],
  //     description: [unit.description, Validators.required],
  //     areaSize: [unit.areaSize, Validators.pattern(this.decimalsOnly)],
  //     beds: [unit.beds, Validators.pattern(this.numbersOnly)],

  //     saleId: [unit.sale?.id],
  //     salePriceTarget: [unit.sale?.priceTarget, Validators.pattern(this.decimalsOnly)],
  //     salePriceAchieved: [unit.sale?.priceAchieved, Validators.pattern(this.decimalsOnly)],
  //     saleStatus: [unit.sale?.status || 'available'],
  //     saleStatusDate: [unit.sale?.statusDate],
  //     saleBuyer: [unit.sale?.buyer],

  //     leaseId: [unit.lease?.id],
  //     leaseRentTargetAmount: [unit.lease?.rentTargetAmount || 0, Validators.pattern(this.decimalsOnly)],
  //     leaseRentAchievedAmount: [unit.lease?.rentTargetAmount || 0, Validators.pattern(this.decimalsOnly)],
  //     leaseStartDate: [unit.lease?.startDate],
  //     leaseDuration: [unit.lease?.durationValue || 0, Validators.pattern(this.numbersOnly)],
  //     leaseTenant: [unit.lease?.tenant],
  //   });
  // };

  // onAddUnit(unit?: Unit) {
  //   const unitToAdd = unit ?? new Unit(this.assetClass);
  //   const unitForm = this.unitToFormGroup(unitToAdd);

  //   this.subs.push(
  //     unitForm.valueChanges
  //       .pipe(debounceTime(500))
  //       .subscribe(value => this.calculateUnitTotals())
  //   );


  //   this.units.push(unitForm);
  // };

  // formGroupToUnit(unitForm: FormGroup): Unit {
  //   const unit = new Unit(this.assetClass);

  //   unit.id = unitForm.get('id')?.value;
  //   unit.identifier = unitForm.get('identifier')?.value;
  //   unit.description = unitForm.get('description')?.value;
  //   unit.areaSize = unitForm.get('areaSize')?.value;
  //   unit.beds = unitForm.get('beds')?.value;

  //   unit.sale = {
  //     id: unitForm.get('saleId')?.value,
  //     unitId: unitForm.get('id')?.value,
  //     status: unitForm.get('saleStatus')?.value,
  //     statusDate: unitForm.get('saleStatusDate')?.value,
  //     priceTarget: unitForm.get('salePriceTarget')?.value,
  //     priceAchieved: unitForm.get('salePriceAchieved')?.value,
  //     buyer: unitForm.get('saleBuyer')?.value
  //   };

  //   unit.lease = {
  //     id: unitForm.get('leaseId')?.value,
  //     unitId: unitForm.get('id')?.value,
  //     startDate: unitForm.get('leaseStartDate')?.value,
  //     durationValue: unitForm.get('leaseDurationValue')?.value,
  //     durationUnit: this.leaseFrequency,
  //     rentTargetAmount: unitForm.get('leaseRentTargetAmount')?.value,
  //     rentTargetFrequency: this.rentFrequency,
  //     rentAchievedAmount: unitForm.get('leaseRentTargetAmount')?.value,
  //     rentAchievedFrequency: this.rentFrequency,
  //     tenant: unitForm.get('leaseTenant')?.value
  //   };

  //   return unit;
  // }

  // populateForm() {
  //   this.assetClass.units.forEach(unit => {
  //     this.onAddUnit(unit);
  //   });

  //   this.calculateUnitTotals()
  // }

  // onRemoveUnit() {
  //   if (this.units.at(this.index).get('id')?.value) {
  //     const indexUnit = this.assetClass.units.findIndex(unit => unit.id === this.units.at(this.index).get('id')?.value);
  //     this.unitsToDelete.push(this.assetClass.units[indexUnit]);
  //     // this.assetClass.units.splice(indexUnit, 1);
  //   }

  //   this.units.removeAt(this.index);
  //   this.mode = 'edit';
  // };

  // onConfirmDelete(index: number) {
  //   this.mode = 'delete';
  //   this.index = index;
  // }


  // defineRentFrequency(): 'weekly' | 'monthly' {
  //   const use: string = this.assetClass.use;
  //   return use === 'student_accommodation' ? 'weekly' : 'monthly';
  // };

  // defineLeaseFrequency(): 'weeks' | 'months' {
  //   const use: string = this.assetClass.use;
  //   return use === 'student_accommodation' ? 'weeks' : 'months';
  // };

  // onCancelDelete() {
  //   this.mode = 'edit';
  // }

  // onSave() {
  //   if (!this.form.valid) {
  //     return;
  //   };

  //   const units: Unit[] = this.units.controls.map((control: AbstractControl) => {
  //     const unitForm = control as FormGroup;
  //     return this.formGroupToUnit(unitForm);
  //   });

  //   if(this.unitsToDelete.length > 0) {
  //     this.deleteUnits(this.unitsToDelete);
  //   };

  //   this._schemeService.updateOrCreateUnits(units)
  //     .subscribe((unitRes: Unit[]) => {
  //       // this.assetClass.units = unitRes;
  //       this.modalSaveUnitSchedule.emit(unitRes)
  //       console.log("unitRes", unitRes);
  //     });
  // }

  // deleteUnits(units: Unit[]) {
  //   this._schemeService.deleteUnits(units).subscribe();
  // }



  // getFormArrayErrorMessages(formArray: FormArray): string[] {
  //   const errorMessages: string[] = [];
  //   const controlsStep1 = ['identifier', 'description', 'areaSize', 'beds'];
  //   const controlsStep2 = ['salePriceTarget', 'salePriceAchieved', 'saleStatus', 'saleStatusDate', 'saleBuyer', 'leaseRentAmount', 'leaseStartDate', 'leaseDuration', 'leaseTenant'];

  //   for (const control of formArray.controls) {
  //     const formGroup = control as FormGroup;

  //     for (const controlName in formGroup.controls) {

  //       if (this.step === 1 && !controlsStep1.includes(controlName) || this.step === 2 && !controlsStep2.includes(controlName)) {
  //         continue;
  //       };

  //       const controlInstance = formGroup.get(controlName);
  //       const errorType = controlInstance?.errors ? Object.keys(controlInstance.errors)[0] : null;

  //       // console.log("controlInstance?.errors", controlInstance?.errors);

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

  // compareFn(satus1: string, satus2: string): boolean {
  //   return satus1 === satus2;
  // }

  // onNext() {
  //   this.nextIsClicked = true;

  //   if (this.form.valid) {
  //     this.nextIsClicked = false;
  //     this.step++;
  //     this.updateStatus();
  //   }
  // }

  // onPrevious() {
  //   this.nextIsClicked = false;
  //   this.step--;
  //   this.updateStatus();
  // }

  // updateStatus() {
  //   if (this.step === 1) {
  //     this.unitsStatus = "active";
  //     this.salesStatus = "inactive";
  //     this.lettingsStatus = "inactive";
  //   } else {
  //     this.unitsStatus = "complete";
  //     this.salesStatus = "active";
  //     this.lettingsStatus = "active";
  //   }
  // }

  // uniqueValueValidator(controlName: string): ValidatorFn {
  //   return (control: AbstractControl) => {
  //     if (!(control instanceof FormControl)) {
  //       return null;
  //     }

  //     const currentControl = control;

  //     const duplicateControl = this.units.controls.find((control: AbstractControl) => {
  //       const formGroup = control as FormGroup;
  //       const formControl = formGroup.get(controlName) as FormControl;

  //       return currentControl !== formControl && currentControl?.value === formControl.value;
  //     });

  //     return duplicateControl ? { uniqueValue: true } : null;
  //   };
  // }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
