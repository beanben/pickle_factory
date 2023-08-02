import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Lease, Sale, Unit, UnitScheduleData} from 'src/app/_interfaces/scheme.interface';
import {UnitService} from 'src/app/_services/unit/unit.service';
import {AssetClassType} from 'src/app/_types/custom.type';

@Component({
  selector: 'app-upload-step-five',
  templateUrl: './upload-step-five.component.html',
  styleUrls: ['./upload-step-five.component.css']
})
export class UploadStepFiveComponent implements OnInit, OnChanges {
  unitScheduleDataRes: UnitScheduleData[] = [];
  @Input() assetClass = {} as AssetClassType;
  @Input() unitsFormGroup: FormGroup = this.fb.group({
    data: this.fb.array([])
  });
  @Input() salesFormGroup: FormGroup = this.fb.group({
    data: this.fb.array([])
  });
  @Input() leasesFormGroup: FormGroup = this.fb.group({
    data: this.fb.array([])
  });

  get unitsFormArray(): FormArray {
    return this.unitsFormGroup.get('data') as FormArray;
  }
  get salesFormArray(): FormArray {
    return this.salesFormGroup.get('data') as FormArray;
  }
  get leasesFormArray(): FormArray {
    return this.leasesFormGroup.get('data') as FormArray;
  }
  @Output() modalCloseUnitsSchedule = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private _unitService: UnitService) {}

  ngOnInit(): void {
    // if (this.assetClass.investmentStrategy === 'buildToSell') {
    //   this.updateOrCreateUnitsScheduleBTS();
    // } else {
    //   this.updateOrCreateUnitsScheduleBTR();
    // }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['unitsFormGroup'] && changes['unitsFormGroup'].currentValue) {
      this.createUnitSchedule();

    }
  }

  createUnitSchedule() {
    if (this.assetClass.investmentStrategy === 'buildToSell') {
      this.updateOrCreateUnitsScheduleBTS();
    } else {
      this.updateOrCreateUnitsScheduleBTR();
    }
  }

  FormGroupToUnit(form: FormGroup): Unit {
    const unit = {
      id: form.get('id')?.value,
      assetClassId: this.assetClass.id,
      identifier: form.get('identifier')?.value,
      description: form.get('description')?.value || '',
      beds: form.get('beds')?.value,
      areaSize: form.get('areaSize')?.value || 0.0
    };
    return unit;
  }

  FormGroupToSale(form: FormGroup, unit: Unit): Sale {
    // ensure date fields are date objects, not strings
    const statusDate = form.get('statusDate')?.value;

    const sale = {
      id: form.get('id')?.value,
      unitId: unit.id,
      status: form.get('status')?.value,
      statusDate: statusDate,
      priceTarget: form.get('priceTarget')?.value || 0.0,
      priceAchieved: form.get('priceAchieved')?.value || 0.0,
      buyer: form.get('buyer')?.value || '',
      ownershipType: form.get('ownershipType')?.value
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
      startDate: form.get('startDate')?.value,
      endDate: form.get('endDate')?.value,
      leaseType: form.get('leaseType')?.value
    };

    return lease;
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

  updateOrCreateUnitsScheduleBTS() {
    const unitsScheduleDataBTS: UnitScheduleData[] = this.combineUnitAndSaleForms();

    this._unitService
      .updateOrCreateUnitsScheduleBTS(unitsScheduleDataBTS)
      .subscribe((unitScheduleDataRes: UnitScheduleData[]) => {
        this.unitScheduleDataRes = unitScheduleDataRes;
        // this.modalSaveUnitsSchedule.emit(unitScheduleDataRes);
        // this.setAssetClassDataSub(this.assetClass, unitScheduleDataRes);
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

  updateOrCreateUnitsScheduleBTR() {
    const unitsScheduleDataBTR: UnitScheduleData[] = this.combineUnitAndLeaseForms();

    this._unitService
      .updateOrCreateUnitsScheduleBTR(unitsScheduleDataBTR)
      .subscribe((unitScheduleDataRes: UnitScheduleData[]) => {
        this.unitScheduleDataRes = unitScheduleDataRes;
        // this.modalSaveUnitsSchedule.emit(unitScheduleDataRes);
        // this.setAssetClassDataSub(this.assetClass, unitScheduleDataRes);
      });
  }

  onCloseModal(){
    this.modalCloseUnitsSchedule.emit();
  }
}
