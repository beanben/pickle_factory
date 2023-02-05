import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme } from '../../scheme';

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
  subs: Subscription[] = [];
  unitAdded = false;

  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveUnit = new EventEmitter<void>();
  requiredControls: string[] = [];
  invalidControlsType: { controlName: string, controlType: string }[] = [];

  area_type_choices = [
    { value: "NIA", display: "NIA", meaning: "Net Internal Area" },
    { value: "NSA", display: "NSA", meaning: "Net Saleable Area" },
    { value: "GIA", display: "GIA", meaning: "Gross Internal Area" },
  ];

  asset_class_choices = [
    { value: "BTS", display: "Residential - Build to Sell" },
    { value: "BTL", display: "Residential - Build to Let" },
    { value: "H", display: "Hotel" },
    { value: "C", display: "Commercial" },
    { value: "O", display: "Office" },
    { value: "S", display: "Shopping Centre" },
    { value: "PBSA", display: "Student Accommodation" }
  ];

  default_choices: { [key: string]: any } = {
    "BTS": { units: "units", beds: "beds", area: "NIA" },
    "BTL": { units: "units", beds: "beds", area: "NIA" },
    "H": { units: "rooms", beds: "beds", area: "NIA" },
    "C": { units: "units", beds: null, area: "GIA" },
    "O": { units: "units", beds: null, area: "GIA" },
    "S": { units: "units", beds: null, area: "GIA" },
    "PBSA": { units: "rooms", beds: "beds", area: "NIA" },
  }

  form: FormGroup = this.fb.group({
    asset_class: ['', Validators.required],
    area_type: [this.area_type_choices[0].value],
    unitsArray: this.fb.array([])
  })
  get asset_class() {
    return this.form.get('asset_class')
  };
  get area_type() {
    return this.form.get('area_type')
  };
  get unitsArray(): FormArray {
    return this.form.get("unitsArray") as FormArray
  }

  newUnit(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      units: [null, [Validators.required, Validators.pattern(this.numbersOnly)]],
      beds: [null, Validators.pattern(this.numbersOnly)],
      area: [null, Validators.pattern(this.numbersOnly)]
    })
  }


  constructor(
    private el: ElementRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();

    this.assetClassStatus = "active";
    this.detailStatus = "inactive";

    this.addUnit();
    this.subs.push(
      this.unitsArray.valueChanges.subscribe(() => {
        this.calculateTotals();
        this.getInvalidControls();
      })
    )

  }

  addUnit() {
    this.unitAdded = true;

    this.unitsArray.insert(0, this.newUnit());

    if(this.unitsArray.length === 1){
      this.unitsArray.at(0).get("type")!.patchValue("Total");
    } else if (this.unitsArray.length === 2) {
      this.unitsArray.at(1).get("type")!.reset();
    }
  }

  removeUnit(index: number) {
    this.unitsArray.removeAt(index);

    if(this.unitsArray.length === 1){
      this.unitsArray.at(0).get("type")!.patchValue("Total");
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
    this.modalSaveUnit.emit();
  };

  onNext() {
    this.nextIsClicked = true;

    if (this.asset_class?.valid && this.step === 1) {
      this.assetClassStatus = "complete";
      this.detailStatus = "active";
      this.step += 1;
    };

  }

  onPrevious() {
    this.assetClassStatus = "active";
    this.detailStatus = "inactive";

    this.step -= 1;

    this.unitsArray.clear();
    this.addUnit();
    this.requiredControls = [];
    this.invalidControlsType = [];

    if(this.step === 1){
      this.unitAdded = false;
    }
  }

  onSave() {
    // this.requiredControls = [];
    // this.invalidControlsType = [];

    if (this.unitsArray.length === 1) {
      this.unitsArray.at(0).get("type")!.patchValue("Total")
    };

    this.getInvalidControls();
    if (this.form.valid) {
      console.log("this.form.value: ", this.form.value)
    }
  }

  getInvalidControls() {
    this.requiredControls = [];
    this.invalidControlsType = [];

    let assetClassValue: string = this.asset_class!.value.value;

    for (let i = 0; i < this.unitsArray.length; i++) {
      const unit = this.unitsArray.at(i) as FormGroup;

      for (const controlName in unit.controls) {
        let controlDescription: string = this.default_choices[assetClassValue][controlName];

        if (controlName === "type") {
          controlDescription = "type"
        };

        // get controls with required error
        if (unit.controls[controlName].hasError('required') && !this.requiredControls.includes(controlName)) {
          this.requiredControls.push(controlDescription);
        }

        // get controls w/o required error, but w type error
        const isNotIncluded: boolean = !this.invalidControlsType.some(c => c.controlName === controlName);

        if (isNotIncluded && unit.controls[controlName].hasError('pattern')) {
          if (controlName === "units" || controlName === "beds" || controlName === "area") {
            this.invalidControlsType.push({ controlName: controlDescription, controlType: "number" })
          }
        }
      }

    }
  }





  calculateTotals(): void {
    this.totalUnits = 0;
    this.totalBeds = 0;
    this.totalArea = 0;
    // console.log("this.totalUnits - start: ", this.totalUnits);

    let totalUnits = 0;
    let totalBeds = 0;
    let totalArea = 0;
    this.unitsArray.controls.forEach(control => {
      totalUnits += +control.get('units')?.value || 0;
      totalBeds += +control.get('beds')?.value || 0;
      totalArea += +control.get('area')?.value || 0;

      // console.log("+control.get('units')?.value || 0: ", +control.get('units')?.value || 0);
    });

    this.totalUnits += totalUnits;
    this.totalBeds += totalBeds;
    this.totalArea += totalArea;

    // console.log("this.totalUnits - end: ", this.totalUnits);
  }

  // updateValue(index: number, controlName: string){
  //   let control = this.unitsArray.at(index).get(controlName);

  //   if(control){
  //     let valueUpdated = control.value;
  //     control.setValue(valueUpdated);
  //   }
  // }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  // onBlur(){
  //   console.log("onBlur");
  // }
  // onKeyEnter(){
  //   console.log("onKeyenter");
  // }

}