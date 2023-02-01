import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    asset_class:  ['', Validators.required],
    area_type: [this.area_type_choices[0].value],
    units: this.fb.array([])
  })
  get asset_class(){
    return this.form.get('asset_class')
  };
  get area_type(){
    return this.form.get('area_type')
  };
  get units(): FormArray{
    return this.form.get("units") as FormArray
  }

  newUnit(): FormGroup {
    return this.fb.group({
      type: [''],
      quantity: [null, Validators.required],
      beds: [null],
      area: [null]
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
    this.units.push(this.newUnit());
  }
  removeUnit(index:number) {
    this.units.removeAt(index);
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

    this.units.clear();
    this.addUnit();
  }

  onSave(){
    if(this.form.valid){
      console.log("this.form.value:", this.form.value)
    }
  }

}
