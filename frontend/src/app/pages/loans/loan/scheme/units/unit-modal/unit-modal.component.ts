import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  // areaStatus = "";
  step = 1;
  nextIsClicked = false;

  htmlTickMark = "&#10003;"

  @Input() mode ="";
  @Output() modalSaveUnit = new EventEmitter<void>();

  form: FormGroup = this.fb.group({
    asset_class: ['', Validators.required],
    type: [''],
    quantity: [0, Validators.required],
    beds: [null],
    area: [null],
    area_type: [''],
    area_metric: ['']
  })

  area_type_choices =[
    {value: "NIA", display: "NIA"},
    {value: "NSA", display: "NSA"},
  ];

  area_metric_choices =[
    {value: "SQFT", display: "square feet"},
    {value: "SQM", display: "square metres"},
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

  get asset_class(){
    return this.form.get('asset_class')
  };

  constructor(
    private el: ElementRef,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();

    this.assetClassStatus = "active";
    this.detailStatus = "inactive";

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
  }

}
