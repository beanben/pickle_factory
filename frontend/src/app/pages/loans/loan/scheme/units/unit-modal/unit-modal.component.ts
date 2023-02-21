import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme, Unit } from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { StringDictionary } from 'src/app/shared/shared';
import { PascalToTitle } from 'src/app/shared/utils';

@Component({
  selector: 'app-unit-modal',
  templateUrl: './unit-modal.component.html',
  styleUrls: ['./unit-modal.component.css']
})
export class UnitModalComponent implements OnInit, OnDestroy {
  displayStyle = "block";
  chevronRight = "assets/images/chevronRight.svg";
  assetClassStatus = "active";
  detailStatus = "inactive";
  step = 1;
  // nextIsClicked = false;
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

  // assetClasses: AssetClassOption[] = [
  //   { label: 'Hotel', value: HotelAssetClass },
  //   { label: 'Residential', value: ResidentialAssetClass },
  //   { label: 'Commercial', value: CommercialAssetClass }
  // ];

  assetClassStructures: { [key: string]: any } = {
    "BTS": { unitType: "unit", beds: "beds", areaType: "NIA" },
    "BTL": { unitType: "unit", beds: "beds", areaType: "NIA" },
    "H": { unitType: "room", beds: "beds", areaType: "NIA" },
    "C": { unitType: "unit", beds: null, areaType: "GIA" },
    "O": { unitType: "unit", beds: null, areaType: "GIA" },
    "S": { unitType: "unit", beds: null, areaType: "GIA" },
    "PBSA": { unitType: "room", beds: "beds", areaType: "NIA" },
  }

  // assetClassForm: FormGroup = this.fb.group({
  //   assetClass: ['', Validators.required],
  // });
  // get assetClass() {
  //   return this.assetClassForm.get('assetClass')
  // };

  form: FormGroup = this.fb.group({
    assetClass: ['', Validators.required],
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
    this.getAssetClassChoices();

    this.subs.push(
      this.units.valueChanges.subscribe(() => {
        // this.calculateTotals();
        // this.getInvalidControls();
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

  addUnit() {
    // this.formIsSubmitted = false;
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

  onCancel() {
    this.modalSaveUnits.emit();
  };

  onNext() {
    // this.nextIsClicked = true;
    this.addUnit();
    this.assetClassStatus = "complete";
    this.detailStatus = "active";
    this.step += 1;

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

  onPrevious() {
    this.assetClassStatus = "active";
    this.detailStatus = "inactive";
    // this.formIsSubmitted = false;

    this.step -= 1;

    this.units.clear();

    // EDIT ASSET CLASS HERE
    
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
    // this.requiredControls = [];
    // this.invalidControlsType = [];
    // let assetClassValue: string = this.assetClass!.value.value;

    // this.units.controls.forEach((newUnit, index) => {
    //   if (this.units.at(index).invalid) {

    //     Object.keys((newUnit as FormGroup).controls).forEach((controlName: string) => {
    //       let formControl = newUnit.get(controlName)! as FormControl;

    //       // if (formControl.invalid && (formControl.submitted || newUnit.dirty)) {
    //       if (formControl.invalid && (this.formIsSubmitted || newUnit.dirty)) {


    //         let controlDescription: string = controlName;
    //         if (controlName === "quantity") {
    //           controlDescription = this.assetClassStructures[assetClassValue].unitType
    //         };

    //         if (formControl.hasError('required') && !this.requiredControls.includes(controlDescription)) {
    //           this.requiredControls.push(controlDescription)

    //         } else if (formControl.hasError('pattern') && !this.invalidControlsType.find(control => control.name === controlDescription)) {
    //           this.invalidControlsType.push({ name: controlDescription, type: "number" })
    //         }
    //       }

    //     })
    //   }
    // });
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

  getAssetClassChoices(){
    const assetClassChoices: string[] = this._schemeService.assetClassChoicesSub.getValue();

    if(assetClassChoices.length === 0){
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

  // build a method , in typescript, which take a string in camel case and returns a string with space between capital letters and converts all letters into lower case, exact the first
  // example: "camelCaseString" => "Camel case string"
  // example: "camelCaseStringWithNumbers123" => "Camel case string with numbers123"
  // example: "camelCaseStringWithNumbers123AndSpecialCharacters!@#$%^&*()" => "Camel case string with numbers123 and special characters!@#$%^&*()"


  // build a method , in typescript, which take a string in camel case and returns a string with space between capital letters and converts all letters into lower case, exact the first
  // example: "camelCaseString" => "Camel case string"


  // build a method , in typescript, which take a string in camel case and returns a string with space between capital letters and converts all letters into lower case, exact the first  
 

  

}