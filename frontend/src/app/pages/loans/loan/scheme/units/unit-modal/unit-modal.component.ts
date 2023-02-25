import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme, Unit, Hotel, Residential, Retail, StudentAccommodation, Office, ShoppingCentre } from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { StringDictionary } from 'src/app/shared/shared';
import { PascalToTitle } from 'src/app/shared/utils';

@Component({
  selector: 'app-unit-modal',
  templateUrl: './unit-modal.component.html',
  styleUrls: ['./unit-modal.component.css'],
})
export class UnitModalComponent implements OnInit, OnDestroy {
  displayStyle = "block";
  chevronRight = "assets/images/chevronRight.svg";
  assetClassStatus = "active";
  detailStatus = "inactive";
  areaStatus = "inactive";
  step = 1;
  areaType = "";
  areaSystem = "";
  areaSystemChoices = ["SQFT", "SQM"];

  clickToDetail = false;
  clickToArea = false
  // showError = false;
  numbersOnly = /^\d+$/;
  totalUnits = 0;
  totalBeds = 0;
  totalArea = 0;
  formIsSubmitted = false;
  // valueChanged = false;
  assetClassesChoices: string[] = [];

  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveUnits = new EventEmitter<Unit[] | null>();

  requiredControls: string[] = [];
  errors: string[] = [];
  invalidControlsType: { name: string, type: string }[] = [];
  subs: Subscription[] = [];
  assetClassChoices: StringDictionary = {};
  assetClassType = {} as Hotel |
                    Residential | 
                    Retail | 
                    StudentAccommodation | 
                    Office | 
                    ShoppingCentre;

  // assetClasses: AssetClassOption[] = [
  //   { label: 'Hotel', value: HotelAssetClass },
  //   { label: 'Residential', value: ResidentialAssetClass },
  //   { label: 'Commercial', value: CommercialAssetClass }
  // ];

  // assetClassStructures: { [key: string]: any } = {
  //   "BTS": { unitType: "unit", beds: "beds", areaType: "NIA" },
  //   "BTL": { unitType: "unit", beds: "beds", areaType: "NIA" },
  //   "H": { unitType: "room", beds: "beds", areaType: "NIA" },
  //   "C": { unitType: "unit", beds: null, areaType: "GIA" },
  //   "O": { unitType: "unit", beds: null, areaType: "GIA" },
  //   "S": { unitType: "unit", beds: null, areaType: "GIA" },
  //   "PBSA": { unitType: "room", beds: "beds", areaType: "NIA" },
  // }

  // assetClassForm: FormGroup = this.fb.group({
  //   assetClass: ['', Validators.required],
  // });
  // get assetClass() {
  //   return this.assetClassForm.get('assetClass')
  // };

  form: FormGroup = this.fb.group({
    assetClass: ['', Validators.required],
    areaType: [''],
    system: [''],
    units: this.fb.array([])
  })
  get assetClass() {
    return this.form.get('assetClass')
  };
  get units(): FormArray {
    return this.form.get("units") as FormArray
  }
  // get areaType() {
  //   return this.form.get('areaType')
  // };

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.step = 1;
    this.addEventBackgroundClose();
    this.getAssetClassChoices();

    this.subs.push(
      this.units.valueChanges.subscribe(() => {
        this.calculateTotals();
        this.clickToArea ? this.getInvalidControls(): null ;
      })
    )
  };

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  newUnit(): FormGroup {
    return this.fb.group({
      label: ['unit'],
      description: ['', Validators.required],
      quantity: [null, [Validators.required, Validators.pattern(this.numbersOnly)]],
      beds: [null, Validators.pattern(this.numbersOnly)],
      area: this.fb.array([]),
    })
  }

  newArea(): FormGroup {
    return this.fb.group({
      size: [null, Validators.pattern(this.numbersOnly)],
      type: ['NIA', Validators.required],
      system: ['SQFT', Validators.required],
    })
  }

  assetClassHasBeds():boolean {
    return this.assetClass!.value !== 'Office' && this.assetClass!.value !== 'Shopping Centre';
  }

  addArea() {
    const unitArea = this.units.at(0).get('area') as FormArray;
    unitArea.insert(0, this.newArea());
  }

  addUnit() {
    this.units.insert(0, this.newUnit());
    this.units.at(0).get('label')?.patchValue(this.unitLabelIs());
    this.addArea();

    if (this.units.length === 1) {
      this.units.at(0).get("description")!.patchValue("Total");

    } else if (this.units.length === 2) {
      this.units.at(1).get("description")!.reset();
    }
  }

  removeArea(indexUnit: number, indexArea: number) {
    const unitArea = this.units.at(indexUnit).get('area') as FormArray;
    unitArea.removeAt(indexArea);
  }

  

  removeUnit(index: number) {
    this.units.removeAt(index);

    if (this.units.length === 1) {
      this.units.at(0).get("description")!.patchValue("Total");
    }
  }

  onCancel() {
    this.modalSaveUnits.emit();
  };

  nextToDetail() {
    this.clickToDetail = true;

    if(!!this.assetClass!.valid){
      this.assetClassIs(this.assetClass!.value);
      this.addUnit();
      this.step += 1;
      this.updateStatus();

      const unitArea = this.units.at(0).get('area') as FormArray;
      this.areaType = unitArea.at(0).get('type')!.value;
      this.areaSystem = unitArea.at(0).get('system')!.value;
    }
    

    // if (this.assetClassForm.valid) {
    //   let assetClass: AssetClass = {
    //     assetClassType: this.assetClass!.value,
    //     schemeId: this.scheme.id
    //   };

    //   this._schemeService.createAssetClass(assetClass)
    //     .then((res: APIResult) => {
    //       this.assetClassCreated = res.response;
    //     })
    //     .catch(err => this.errors = err)

    // }

  }

  nextToArea() {
    this.clickToArea = true;
    this.getInvalidControls();

    if(this.units.valid){
      this.addArea();
      this.step += 1;
      this.updateStatus();
    }
  }


  updateStatus(){
    if(this.step===1){
      this.assetClassStatus = "active";
      this.detailStatus = "inactive";
      this.areaStatus = "inactive";
    } else if(this.step === 2){
      this.assetClassStatus = "complete";
      this.detailStatus = "active";
      this.areaStatus = "inactive";
    } else {
      this.assetClassStatus = "complete";
      this.detailStatus = "complete";
      this.areaStatus = "active";
    }

  }

  assetClassIs(type:string){
    switch(type){
      case "Hotel":
        this.assetClassType = {} as Hotel;
        break;
      case "Residential":
        this.assetClassType = {} as Residential;
        break;
      case "Retail":
        this.assetClassType = {} as Retail;
        break;
      case "Student Accommodation":
        this.assetClassType = {} as StudentAccommodation;
        break;
      case "Office":
        this.assetClassType = {} as Office;
        break;
      case "Shopping Centre":
        this.assetClassType = {} as ShoppingCentre;
        break;
    }
  }

  unitLabelIs(): string{
    const assetClass: string = this.assetClass!.value;
    
    if(assetClass === "Hotel" || assetClass === "Student Accommodation"){
        return "room";
    } else {
       return "unit"
    }
  }


  onPrevious() {

    // this.formIsSubmitted = false;

    this.step -= 1;
    this.updateStatus();
    this.step === 1 ? this.units.clear() : null;

    // this.units.clear();

    
    // this.requiredControls = [];
    // this.invalidControlsType = [];
  }

  onSave() {
    this.formIsSubmitted = true;
    // this.getInvalidControls();

    // if(this.form.valid) {
    //   let units: Unit[] = [];

    //   this.units.controls.forEach(newUnit => {

    //     const unit = {} as Unit;
    //     unit.schemeId = this.scheme.id;
    //     unit.assetClass = this.assetClass!.value;
    //     unit.unitType = this.assetClassStructures[unit.assetClass].unitType;
    //     unit.description = newUnit.get("description")!.value;
    //     unit.quantity = newUnit.get("quantity")!.value;

    //     if (newUnit.get("beds")!.value) {
    //       unit.beds = newUnit.get("beds")!.value;
    //     };
    //     if (newUnit.get("area")!.value) {
    //       unit.area = newUnit.get("area")!.value;
    //       unit.areaType = this.assetClassStructures[unit.assetClass].areaType;
    //     };

    //     units.push(unit);
    //   });

    //   this.createUnits(units);
    // }
  }

  createUnits(units: Unit[]) {

    // this._schemeService.createUnits(units)
    //   .then((res: APIResult) => {
    //     let unitsCreated: Unit[] = res.response;   
    //     this.modalSaveUnits.emit(unitsCreated);
    //   })
    //   .catch(err => this.errors = err)
  }

  getInvalidControls() {
    this.requiredControls = [];
    this.invalidControlsType = [];

    // get all the invalid form controls from units
    let invalidUnits: FormGroup[] = [];
    this.units.controls.forEach(unit => unit.valid ? null : invalidUnits.push(unit as FormGroup));
    

    // get all the invalid form controls from each invalid unit
    let invalidUnitControls: FormControl[] = [];
    invalidUnits.forEach(invalidUnit => {
      
      Object.keys(invalidUnit.controls).forEach(controlName => {
        let control = invalidUnit.get(controlName) as FormControl;
        let controlLabel: string = controlName === "quantity" ? this.unitLabelIs() : controlName;

        if(control.hasError('required') && !this.requiredControls.includes(controlLabel)){
          this.requiredControls.push(controlLabel)
        }

        if(control.hasError('pattern') && !this.invalidControlsType.find(control => control.name === controlLabel)){
          let requiredType:string = controlName === "description" ? "text" : "number";
          
          this.invalidControlsType.push({ name: controlLabel, type: requiredType })
        }

        control.valid ? null : invalidUnitControls.push(control);
      })
    })
  }

  calculateTotals(): void {
    this.totalUnits = 0;
    this.totalBeds = 0;
    // this.totalArea = 0;

    let totalUnits = 0;
    let totalBeds = 0;
    let totalArea = 0;
    this.units.controls.forEach(control => {
      totalUnits += +control.get('quantity')?.value || 0;
      totalBeds += +control.get('beds')?.value || 0;
      // totalArea += +control.get('area')?.value || 0;
    });

    this.totalUnits += totalUnits;
    this.totalBeds += totalBeds;
    // this.totalArea += totalArea;
  }

  getAssetClassChoices(){
    const assetClassChoicesSub: string[] = this._schemeService.assetClassChoicesSub.getValue();
    this.assetClassesChoices = assetClassChoicesSub;

    if(this.assetClassesChoices.length === 0){
      this.getReqAssetClassChoices()
    }

  }

  getReqAssetClassChoices(){
    this._schemeService.getAssetClassChoices()
      .subscribe((res: string[]) => {

        const formattedChoices: string[] = [];
        res.forEach(choice => {
          formattedChoices.push(PascalToTitle(choice))
        })

        this.assetClassesChoices = formattedChoices;
        this._schemeService.setAssetClassChoicesSub(formattedChoices); 
      })
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}