import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';
import { Choice } from 'src/app/shared/shared';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toCamelCase } from 'src/app/shared/utils';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

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

  form: FormGroup = this.fb.group({
    units: this.fb.array([],
      {
        validators: [
          this.allRequiredValidator('identifier'),
          this.allRequiredValidator('description'),
          this.allRequiredValidator('areaSize'),
          this.allPatternValidator('areaSize'),
          this.allPatternValidator('beds'),
          this.allPatternValidator('salePrice'),
          this.allPatternValidator('leaseRent')
        ]
      })
  })

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
          label: toCamelCase(choice.label)
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

  newUnit() {
    return this.fb.group({
      identifier: ['', Validators.required],
      description: ['', Validators.required],
      areaSize: [0, [Validators.required, Validators.pattern(this.decimalsOnly)]],
      beds: [0, [Validators.required, Validators.pattern(this.numbersOnly)]],

      salePriceTarget: [0, Validators.pattern(this.decimalsOnly)],
      salePriceAchieved: [0, Validators.pattern(this.decimalsOnly)],
      saleStatus: ['available'],
      saleStatusDate: [null],
      saleBuyer: [''],

      leaseRent: [0, Validators.pattern(this.decimalsOnly)],
      leaseStartDate: [''],
      leaseDuration: [''],
      leaseTenant: [''],
    })
  }

  onAddUnit() {
    (this.form.get('units')! as FormArray).push(this.newUnit());
  }

  populateForm() {
    this.assetClass.units.forEach(unit => {
      const unitForm: FormGroup = this.fb.group({
        id: [unit.id],

        identifier: [unit.identifier, Validators.required],
        description: [unit.description, Validators.required],
        areaSize: [unit.areaSize, Validators.required],
        beds: [unit.beds, Validators.required],

        salePrice: [unit.sale?.price],
        saleBuyer: [unit.sale?.buyer],

        leaseStartDate: [unit.lease?.startDate],
        leaseEndDate: [unit.lease?.endDate],
        leaseRent: [unit.lease?.rent],
        leaseTenant: [unit.lease?.tenant],
      });

      (this.form.get('units')! as FormArray).push(unitForm)
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

    const units: Unit[] = this.form.value.units.map((unit: Unit) => {
      return {
        id: unit?.id,
        identifier: unit?.identifier,
        description: unit?.description,
        areaSize: unit?.areaSize,
        beds: unit?.beds,

        sale: {
          price: unit.sale?.price,
          buyer: unit.sale?.buyer
        },

        lease: {
          startDate: unit.lease?.startDate,
          endDate: unit.lease?.endDate,
          rent: unit.lease?.rent,
          tenant: unit.lease?.tenant
        }
      }
    });

    console.log("units", units);
    console.log("unitsToDelete", this.unitsToDelete);
  };

  allRequiredValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!(control instanceof FormArray)) {
        return null;
      }

      const hasEmptyControl: boolean = control.controls.some((abstractControl: AbstractControl) => {
        const formGroup = abstractControl as FormGroup;
        const controlInstance = formGroup.get(controlName);
        return controlInstance?.value === undefined || controlInstance.value === null || controlInstance.value === "" || controlInstance.value === 0;
      })

      return hasEmptyControl ? { [`${controlName}Required`]: true } : null;
    };
  };

  allPatternValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!(control instanceof FormArray)) {
        return null;
      }

      const hasInvalidControl:boolean = control.controls.some((abstractControl: AbstractControl) => {
        const formGroup = abstractControl as FormGroup;
        const controlInstance = formGroup.get(controlName);
        return controlInstance?.hasError('pattern');
      })
      
      return hasInvalidControl ? { [`${controlName}Pattern`]: true } : null;
    };
  };

}
