import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';
import { Choice } from 'src/app/shared/shared';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toCamelCase } from 'src/app/shared/utils';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

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
export class UnitScheduleModalComponent implements OnInit, OnChanges {
  displayStyle = "block";
  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit;
  @Output() modalSaveUnitSchedule = new EventEmitter<Unit[] | null>();
  saleStatusChoices: Choice[] = [];
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  unitsToDelete: Unit[] = [];
  rentFrequency: 'weekly' | 'monthly' = 'weekly';
  leaseFrequency: 'weeks' | 'months' = 'weeks';
  index = 0;
  unitSelected = {} as Unit;
  numbersOnly = /^\d+$/;
  decimalsOnly = /^\d*\.?\d*$/;
  step = 1;
  chevronRight = "assets/images/chevronRight.svg";
  unitsStatus = "active";
  salesStatus = "inactive";
  lettingsStatus = "inactive";

  form: FormGroup = this.fb.group({
    units: this.fb.array([],
      {
        // validators: [
        //   this.allRequiredValidator('identifier'),
        //   this.allRequiredValidator('description'),
        //   this.allRequiredValidator('areaSize'),
        //   this.allPatternValidator('areaSize'),
        //   this.allPatternValidator('beds'),
        //   this.allPatternValidator('salePrice'),
        //   this.allPatternValidator('leaseRent')
        // ]
      })
  });

  validationMessages: ValidationMessages = {
    identifier: {
      required: 'Identifier is required',
    },
    description: {
      required: 'Description is required',
    },
    areaSize: {
      required: 'Area size is required',
      pattern: 'Area size must be a valid number',
    },
    beds: {
      pattern: 'Number of beds must be a valid number',
    },
    salePrice: {
      pattern: 'Sale price must be a valid number',
    },
    leaseRent: {
      pattern: 'Rent must be a valid number',
    },

  };

  get units(): FormArray {
    return this.form.get('units') as FormArray;
  }

  constructor(
    private el: ElementRef,
    private _schemeService: SchemeService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();
    this.getSaleStatusChoices();

    if (this.mode === 'edit') {
      this.populateForm();
    };

    this.rentFrequency = this.defineRentFrequency()
    this.leaseFrequency = this.defineLeaseFrequency()
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass']) {
      this.unitStructure = new Unit(this.assetClass);
      this.calculateUnitTotals();
    }
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  onCancel() {
    this.modalSaveUnitSchedule.emit();
  }

  getSaleStatusChoices(): void {
    this._schemeService.getSaleStatusChoices().subscribe(choices => {

      this.saleStatusChoices = choices.map((choice: Choice) => {
        return {
          value: choice.value,
          // label: toCamelCase(choice.label)
          label: choice.label
        }
      });

    });
  }

  calculateUnitTotals() {
    this.totalUnits = this.assetClass.units?.length ?? 0;

    const totalAreaSizeCalc = this.assetClass.units?.reduce((acc, units) => acc + (+(units.areaSize ?? 0)), 0)
    this.totalAreaSize = +(totalAreaSizeCalc ?? 0).toFixed(2);

    const totalBedsCalc = this.assetClass.units?.reduce((acc, units) => acc + (units.beds ?? 0), 0);
    this.totalBeds = totalBedsCalc ?? 0;
  }

  unitToFormGroup(unit: Unit): FormGroup {
    return this.fb.group({
      id: [unit.id],

      identifier: [unit.identifier, Validators.required],
      description: [unit.description, Validators.required],
      areaSize: [unit.areaSize, Validators.required],
      beds: [unit.beds, Validators.required],

      saleId: [unit.sale?.id],
      salePriceTarget: [unit.sale?.priceTarget],
      salePriceAchieved: [unit.sale?.priceAchieved],
      saleStatus: [unit.sale?.status || 'available'],
      saleStatusDate: [unit.sale?.statusDate],
      saleBuyer: [unit.sale?.buyer],

      leaseId: [unit.lease?.id],
      leaseRentAmount: [unit.lease?.rent.amount],
      leaseStartDate: [unit.lease?.startDate],
      leaseDuration: [unit.lease?.duration],
      leaseTenant: [unit.lease?.tenant],
    });
  };

  newUnit(): FormGroup {
    const newUnit = new Unit(this.assetClass);
    return this.unitToFormGroup(newUnit);
  };

  onAddUnit() {
    (this.form.get('units')! as FormArray).push(this.newUnit());
  };

  formGroupToUnit(unitForm: FormGroup): Unit {
    const unit = new Unit(this.assetClass);

    unit.id = unitForm.get('id')?.value;
    unit.identifier = unitForm.get('identifier')?.value;
    unit.description = unitForm.get('description')?.value;
    unit.areaSize = unitForm.get('areaSize')?.value;
    unit.beds = unitForm.get('beds')?.value;

    unit.sale = {
      id: unitForm.get('saleId')?.value,
      unitId: unitForm.get('id')?.value,
      status: unitForm.get('saleStatus')?.value,
      statusDate: unitForm.get('saleStatusDate')?.value,
      priceTarget: unitForm.get('salePriceTarget')?.value,
      priceAchieved: unitForm.get('salePriceAchieved')?.value,
      buyer: unitForm.get('saleBuyer')?.value
    };

    unit.lease = {
      id: unitForm.get('leaseId')?.value,
      startDate: unitForm.get('leaseStartDate')?.value,
      duration: unitForm.get('leaseDuration')?.value,
      rent: {
        amount: unitForm.get('leaseRentAmount')?.value,
        frequency: this.rentFrequency
      },
      tenant: unitForm.get('leaseTenant')?.value
    };

    return unit;
  }

  populateForm() {
    this.assetClass.units.forEach(unit => {
      const unitForm: FormGroup = this.unitToFormGroup(unit);
      this.units.push(unitForm)
    })
  }

  onRemoveUnit() {
    if (this.units.at(this.index).get('id')?.value) {
      const indexUnit = this.assetClass.units.findIndex(unit => unit.id === this.units.at(this.index).get('id')?.value);
      this.unitsToDelete.push(this.assetClass.units[indexUnit]);
      this.assetClass.units.splice(indexUnit, 1);
    }

    this.units.removeAt(this.index);
    this.mode = 'edit';
  };

  onConfirmDelete(index: number) {
    this.mode = 'delete';
    this.index = index;
  }


  defineRentFrequency(): 'weekly' | 'monthly' {
    const use: string = this.assetClass.use;
    return use === 'student_accommodation' ? 'weekly' : 'monthly';
  };

  defineLeaseFrequency(): 'weeks' | 'months' {
    const use: string = this.assetClass.use;
    return use === 'student_accommodation' ? 'weeks' : 'months';
  };

  onCancelDelete() {
    this.mode = 'edit'
  }

  onSave() {
    if (!this.form.valid) {
      return;
    };

    const units: Unit[] = [];

    this.units.controls.forEach((control: AbstractControl) => {
      const unitForm = control as FormGroup;
      const unit = this.formGroupToUnit(unitForm);
      units.push(unit);
    });

    console.log("units", units);
    console.log("unitsToDelete", this.unitsToDelete);
  };


getFormArrayErrorMessages(formArray: FormArray): string[] {
  const errorMessages: string[] = [];

  for (const control of formArray.controls) {
    const formGroup = control as FormGroup;

    for (const controlName in formGroup.controls) {
      const controlInstance = formGroup.get(controlName);

      const errorType = controlInstance?.errors ? Object.keys(controlInstance.errors)[0] : null;
      if(errorType){
        const message = this.validationMessages[controlName][errorType];
        if(!errorMessages.includes(message)){
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

}
