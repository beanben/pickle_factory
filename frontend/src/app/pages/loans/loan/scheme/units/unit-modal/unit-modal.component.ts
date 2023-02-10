import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme } from '../../scheme';
import { Unit } from '../unit';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { APIResult } from 'src/app/_services/api-result';

@Component({
  selector: 'app-unit-modal',
  templateUrl: './unit-modal.component.html',
  styleUrls: ['./unit-modal.component.css']
})
export class UnitModalComponent implements OnInit, OnDestroy {
  displayStyle = "block";
  chevronRight = "assets/images/chevronRight.svg";
  assetClassStatus = "";
  detailStatus = "";
  step = 1;
  nextIsClicked = false;
  showError = false;
  numbersOnly = /^\d+$/;
  totalUnits = 0;
  totalBeds = 0;
  totalArea = 0;
  formIsSubmitted = false;
  valueChanged = false;

  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveUnits = new EventEmitter<Unit[]|null>();
  requiredControls: string[] = [];
  errors: string[] = [];
  invalidControlsType: { name: string, type: string }[] = [];
  subs: Subscription[] = [];

  areaTypeChoices = [
    { value: "NIA", display: "Net Internal Area"},
    { value: "NSA", display: "Net Salable Area"},
    { value: "GIA", display: "Gross Internal Area"},
  ];
  assetClassChoices = [
    { value: "BTS", display: "Residential - Build to Sell" },
    { value: "BTL", display: "Residential - Build to Let" },
    { value: "H", display: "Hotel" },
    { value: "C", display: "Commercial" },
    { value: "O", display: "Office" },
    { value: "S", display: "Shopping Centre" },
    { value: "PBSA", display: "Student Accommodation" }
  ];

  assetClassStructures: { [key: string]: any } = {
    "BTS": { unitType: "units", beds: "beds", areaType: "NIA" },
    "BTL": { unitType: "units", beds: "beds", areaType: "NIA" },
    "H": { unitType: "rooms", beds: "beds", areaType: "NIA" },
    "C": { unitType: "units", beds: null, areaType: "GIA" },
    "O": { unitType: "units", beds: null, areaType: "GIA" },
    "S": { unitType: "units", beds: null, areaType: "GIA" },
    "PBSA": { unitType: "rooms", beds: "beds", areaType: "NIA" },
  }

  form: FormGroup = this.fb.group({
    assetClass: ['', Validators.required],
    units: this.fb.array([]),
    areaType: ['']
  })
  get assetClass() {
    return this.form.get('assetClass')
  };
  get units(): FormArray {
    return this.form.get("units") as FormArray
  }
  get areaType() {
    return this.form.get('areaType')
  };

  newUnit(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.pattern(this.numbersOnly)]],
      beds: [null, Validators.pattern(this.numbersOnly)],
      area: [null, Validators.pattern(this.numbersOnly)]
    })
  }

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();

    this.assetClassStatus = "active";
    this.detailStatus = "inactive";

    this.addUnit();

    this.subs.push(
      this.units.valueChanges.subscribe(() => {
        this.valueChanged = true;
        this.calculateTotals();
        this.getInvalidControls();
      })
    )

  }

  addUnit() {
    this.formIsSubmitted = false;
    this.units.insert(0, this.newUnit());

    if (this.units.length === 1) {
      this.units.at(0).get("description")!.patchValue("Total");

    } else if (this.units.length === 2) {
      this.units.at(1).get("description")!.reset();
    }
  }

  removeUnit(index: number) {
    this.units.removeAt(index);

    if (this.units.length === 1) {
      this.units.at(0).get("description")!.patchValue("Total");
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
    this.modalSaveUnits.emit();
  };

  onNext() {
    this.nextIsClicked = true;

    if (this.assetClass?.valid && this.step === 1) {
      this.assetClassStatus = "complete";
      this.detailStatus = "active";
      this.step += 1;
    };

  }

  onPrevious() {
    this.assetClassStatus = "active";
    this.detailStatus = "inactive";
    this.formIsSubmitted = false;

    this.step -= 1;

    this.units.clear();
    this.addUnit();
    this.requiredControls = [];
    this.invalidControlsType = [];
  }

  onSave() {

   this.formIsSubmitted = true;
   this.getInvalidControls();
    if (this.form.valid) {
      let units: Unit[] = [];

      this.units.controls.forEach(newUnit => {

        const unit = {} as Unit;
        unit.assetClass = this.assetClass!.value.value;
        unit.type = this.assetClassStructures[unit.assetClass].unitType;
        unit.description = newUnit.get("description")!.value;
        unit.quantity = newUnit.get("quantity")!.value;
        
        if(newUnit.get("beds")!.value) {
          unit.beds = newUnit.get("beds")!.value;
        };
        if(newUnit.get("area")!.value) {
          unit.area = newUnit.get("area")!.value;
          unit.areaType = this.assetClassStructures[unit.assetClass].areaType;
        };
        unit.schemeId = this.scheme.id;

        units.push(unit);
      });

      this.createUnits(units);
    }
  }
  
  createUnits(units: Unit[]){
    this._schemeService.createUnits(units)
    .then((res: APIResult) => {
      let unitsCreated: Unit[] = res.response;

      this.modalSaveUnits.emit(unitsCreated);
    })
    .catch(err => this.errors = err)
  }

  getInvalidControls() {
    this.requiredControls = [];
    this.invalidControlsType = [];
    let assetClassValue: string = this.assetClass!.value.value;

    this.units.controls.forEach((newUnit, index) => {
      if (this.units.at(index).invalid) {

        Object.keys((newUnit as FormGroup).controls).forEach((controlName: string) => {
          let formControl = newUnit.get(controlName)! as FormControl;

          if (formControl.invalid && (this.formIsSubmitted || newUnit.dirty)) {
            
            
            let controlDescription: string = controlName;
            if (controlName === "quantity") { 
              controlDescription = this.assetClassStructures[assetClassValue].unitType
             };

            if (formControl.hasError('required') && !this.requiredControls.includes(controlDescription)) {
              this.requiredControls.push(controlDescription)

            } else if (formControl.hasError('pattern') && !this.invalidControlsType.find(control => control.name === controlDescription)) {
              this.invalidControlsType.push({ name: controlDescription, type: "number" })
            }
          }

        })
      }
    });

  }



  calculateTotals(): void {
    this.totalUnits = 0;
    this.totalBeds = 0;
    this.totalArea = 0;

    let totalUnits = 0;
    let totalBeds = 0;
    let totalArea = 0;
    this.units.controls.forEach(control => {
      totalUnits += +control.get('quantity')?.value || 0;
      totalBeds += +control.get('beds')?.value || 0;
      totalArea += +control.get('area')?.value || 0;
    });

    this.totalUnits += totalUnits;
    this.totalBeds += totalBeds;
    this.totalArea += totalArea;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }


}