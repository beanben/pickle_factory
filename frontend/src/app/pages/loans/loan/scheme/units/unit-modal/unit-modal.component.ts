import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { textValidator } from 'src/app/shared/custom.validators';
// import {TypeValidator } from 'src/app/shared/custom.validators';
import { Scheme } from '../../scheme';

@Component({
  selector: 'app-unit-modal',
  templateUrl: './unit-modal.component.html',
  styleUrls: ['./unit-modal.component.css']
})
export class UnitModalComponent implements OnInit {
  displayStyle = "block";
  chevronRight = "assets/images/chevronRight.svg";
  assetClassStatus = "";
  detailStatus = "";
  step = 1;
  nextIsClicked = false;
  showError = false;
  requiredControls: string[] = [];
  invalidControlsType: any[] = [];
  textOnly = /^[a-zA-Z]+$/;
  numbersOnly = /^\d+$/;

  @Input() mode ="";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveUnit = new EventEmitter<void>();

  // https://www.tektutorialshub.com/angular/nested-formarray-example-add-form-fields-dynamically/
  area_type_choices =[
    {value: "NIA", display: "NIA" , meaning: "Net Internal Area"},
    {value: "NSA", display: "NSA", meaning: "Net Saleable Area"},
    {value: "GIA", display: "GIA", meaning: "Gross Internal Area"},
  ];

  asset_class_choices =[
    {value: "BTS", display: "Residential - Build to Sell"},
    {value: "BTL", display: "Residential - Build to Let"},
    {value: "H", display: "Hotel"},
    {value: "C", display: "Commercial"},
    {value: "O", display: "Office"},
    {value: "S", display: "Shopping Centre"},
    {value: "PBSA", display: "Student Accommodation"}
  ];

  default_choices: {[key: string]: any} = {
    "BTS": {units: "units", beds: "beds", area: "NIA"},
    "BTL": {units: "units", beds: "beds", area: "NIA"},
    "H": {units: "rooms", beds: "beds", area: "NIA"},
    "C": {units: "units", beds: null, area: "GIA"},
    "O": {units: "units", beds: null, area: "GIA"},
    "S": {units: "units", beds: null, area: "GIA"},
    "PBSA": {units: "rooms", beds: "beds", area: "NIA"},
  }

  form: FormGroup = this.fb.group({
    asset_class:  ['', {validators: [Validators.required], updateOn: 'blur'}],
    area_type: [this.area_type_choices[0].value, {updateOn: 'blur'}],
    unitsArray: this.fb.array([])
  })
  get asset_class(){
    return this.form.get('asset_class')
  };
  get area_type(){
    return this.form.get('area_type')
  };
  get unitsArray(): FormArray{
    return this.form.get("unitsArray") as FormArray
  }

  newUnit(): FormGroup {
    return this.fb.group({
      // type: ['', {validators: [Validators.required, textValidator()], updateOn: 'blur'}],
      type: ['', {validators: [Validators.required, Validators.pattern(this.textOnly)], updateOn: 'blur'}],
      units: [null, {validators: [Validators.required, Validators.pattern(this.numbersOnly)], updateOn: 'blur'}],
      beds: [null, {validators: [Validators.pattern(this.numbersOnly)], updateOn: 'blur'}],
      area: [null, {validators: [Validators.pattern(this.numbersOnly)], updateOn: 'blur'}],
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

  }

  addUnit() {
      this.unitsArray.push(this.newUnit());
  }

  removeUnit(index:number) {
    this.unitsArray.removeAt(index);
  }

  addEventBackgroundClose(){
    this.el.nativeElement.addEventListener('click', (el:any) => {
      if (el.target.className === 'modal') {
          this.onCancel();
      }
    });
  };

  onCancel(){
    this.modalSaveUnit.emit();
  };

  onNext(){
   this.nextIsClicked = true;
  
   if(!!this.asset_class?.valid && this.step === 1){
    this.assetClassStatus = "complete";
    this.detailStatus = "active";
   };

   this.step += 1;

  }

  onPrevious(){
    this.assetClassStatus = "active";
    this.detailStatus = "inactive";

    this.step -= 1;

    this.unitsArray.clear();
    this.addUnit();
  }

  onSave(){
    this.getInvalidControls();
  }

  getInvalidControls() {
    for (let i = 0; i < this.unitsArray.length; i++) {
      const unit = this.unitsArray.at(i) as FormGroup;

      for (const controlName in unit.controls) {
        if (unit.controls[controlName].hasError('required') && !this.requiredControls.includes(controlName)) {
          this.requiredControls.push(controlName);
        }

        const isNotIncluded: boolean = !this.invalidControlsType.some(c => c.controlName === controlName)

        if(isNotIncluded && unit.controls[controlName].hasError('pattern')){
          if(controlName === "type"){
            this.invalidControlsType.push({controlName: controlName, controlType: "text"})

          } else if(controlName === "units" || controlName==="beds"|| controlName ==="area"){
            this.invalidControlsType.push({controlName: controlName, controlType: "number"})
          }
        }
      }

    }
  }


  // onFocus(){
  //   console.log("is focus")
  // }
  // onBlur(){
  //   console.log("is blur")
  // }

}
