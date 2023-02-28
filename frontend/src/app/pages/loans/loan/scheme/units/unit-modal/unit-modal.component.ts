import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme, Unit, Hotel, Residential, Retail, StudentAccommodation, Office, ShoppingCentre, AssetClass } from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Choice, StringDictionary } from 'src/app/shared/shared';
import { PascalToTitle } from 'src/app/shared/utils';
import { APIResult } from 'src/app/_services/api-result';

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
  step = 1;
  areaType = "";
  areaSystem = "";
  nextIsClicked = false;
  formIsSubmitted = false;
  numbersOnly = /^\d+$/;
  totalUnits = 0;
  totalBeds = 0;
  totalArea = 0;

  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveUnits = new EventEmitter<Unit[] | null>();
  @Output() modalSaveAssetClass = new EventEmitter<AssetClass | null>();

  unitAreaTypes: Choice[] = [];
  assetClassesChoices: string[] = [];
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

  constructor(
    private el: ElementRef,
    private fb: FormBuilder,
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.step = 1;
    this.addEventBackgroundClose();
    this.getAssetClassChoices();
    this.getUnitAreaTypes();

    this.subs.push(
      this.units.valueChanges.subscribe(() => {
        this.calculateTotals();
        this.formIsSubmitted ? this.getInvalidControls(): null ;
      })
    );
  };

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  newUnit(): FormGroup {
    const newUnit = this.fb.group({
      label: ['unit'],
      description: [''],
      quantity: [null, [Validators.required, Validators.pattern(this.numbersOnly)]],
      beds: [null, Validators.pattern(this.numbersOnly)],
      // beds_total: [null],
      areaSize: [null, Validators.pattern(this.numbersOnly)],
      areaType: ['NIA', Validators.required],
    });

    return newUnit
  }



  assetClassHasBeds():boolean {
    const hasBeds = ['student accommodation', 'hotel', 'residential']
    return hasBeds.includes(this.assetClass!.value.toLowerCase())
  }


  addUnit() {
    this.units.insert(0, this.newUnit());

    this.units.at(0).get('label')?.patchValue(this.unitLabelIs());
    this.units.at(0).get('areaType')?.patchValue(
      this.defineUnitAreaType(this.assetClass!.value)
    );

  }

  removeUnit(index: number) {
    this.units.removeAt(index);

    if (this.units.length === 1) {
      this.units.at(0).get("description")!.patchValue("Total");
    }
  }

  onCancel() {
    this.modalSaveAssetClass.emit();
  };

  onNext() {
    this.nextIsClicked = true;

    if(!!this.assetClass!.valid){
      this.assetClassIs(this.assetClass!.value);
      this.addUnit();
      this.step += 1;
      this.updateStatus();
    }

  }

  updateStatus(){
    if(this.step===1){
      this.assetClassStatus = "active";
      this.detailStatus = "inactive";
    } else {
      this.assetClassStatus = "complete";
      this.detailStatus = "active";
    }
  }

  defineUnitAreaType(assetClassType:string): string{
    switch(assetClassType){
      case "Hotel":
      case "Residential":
      case "Student Accommodation":
        return "NIA";
      
      case "Retail":
      case "Office":
      case "Shopping Centre":
        return "GIA";

      default:
        return "NIA";
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
    this.formIsSubmitted = false;

    this.step -= 1;
    this.updateStatus();
    this.units.clear()

  }

  onSave() {
    this.formIsSubmitted = true;
    this.getInvalidControls();

    console.log("onSave: ")
    console.log("this.form.valid: ", this.form.valid)
    if (!this.form.valid) {
      return;
    }

    const assetClassType = this.assetClass!.value;

    const assetClass = {} as AssetClass;
    assetClass.schemeId = this.scheme.id;

    this._schemeService.createAssetClass(assetClass, assetClassType)
      .then((result:APIResult) => {
        let assetClassCreated = this.allocateAssetClassInterface(result, this.assetClass!.value);

        this.units.controls.forEach(newUnit => {
          const unit: Unit = this.createUnitInterface(assetClassCreated, newUnit);

          const units: Unit[] = Array.from(
            {length: newUnit.get('quantity')!.value},
            () => unit
          );
          
          this._schemeService.createUnits(units)
            .then((result:APIResult) => {
              const unitsCreated: Unit[] = result.response;
              assetClassCreated.units = unitsCreated;

              this.modalSaveAssetClass.emit(assetClassCreated);

            })
        })
      })
  }

  allocateAssetClassInterface(result: APIResult, assetClassValue: string) {

    if(assetClassValue === "Hotel"){
      return result.response as Hotel;
    } else if(assetClassValue === "Residential"){
      return result.response as Residential;
    } else if(assetClassValue === "Retail"){
      return result.response as Retail;
    } else if(assetClassValue === "Student Accommodation"){
      return result.response as StudentAccommodation;
    } else if(assetClassValue === "Office"){
      return result.response as Office;
    } else if(assetClassValue === "Shopping Centre"){
      return result.response as ShoppingCentre;
    } else {
      return result.response as AssetClass;
    }

}

  createUnitInterface(assetClass:AssetClass, newUnit:AbstractControl): Unit{
    const unit: Unit = {
              assetClassId: assetClass.id,
              label: newUnit.get('label')!.value,
    };
    if(newUnit.get('description')?.value){
      unit.description = newUnit.get('description')!.value;
    };
    if(newUnit.get('areaSize')?.value){
      unit.areaSize = newUnit.get('areaSize')!.value;
      unit.areaType = newUnit.get('areaType')!.value;
    };
    if(newUnit.get('beds')?.value){
      unit.beds = newUnit.get('beds')!.value;
    }

    return unit;
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
        let controlLabel: string = this.controlLabels(controlName);

        if(control.hasError('required') && !this.requiredControls.includes(controlLabel)){
          this.requiredControls.push(controlLabel)
        }

        if(control.hasError('pattern') && !this.invalidControlsType.find(control => control.name === controlLabel)){
          let requiredType:string = this.requiredType(controlName);
          
          this.invalidControlsType.push({ name: controlLabel, type: requiredType })
        }

        control.valid ? null : invalidUnitControls.push(control);
      })
    })
  }

  controlLabels(controlName: string): string{
    if(controlName === "quantity"){
      return this.unitLabelIs();
    } else if(controlName === "area_size") {
      return "area";
    } else {
      return controlName;
    }
  }

  requiredType(controlName: string): string{
    return controlName === "description" ? "text" : "number";
  }

  calculateTotals(): void {
    this.totalUnits = 0;
    // this.totalBeds = 0;
    this.totalArea = 0;

    let totalUnits = 0;
    // let totalBeds = 0;
    let totalArea = 0;
    this.units.controls.forEach(control => {
      totalUnits += +control.get('quantity')?.value || 0;
      // totalBeds += +control.get('beds_total')?.value || 0;
      totalArea += +control.get('areaSize')?.value || 0;
    });

    this.totalUnits += totalUnits;
    // this.totalBeds += totalBeds;
    this.totalArea += totalArea;
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

  getUnitAreaTypes(){
    this._schemeService.getUnitAreaTypes()
      .subscribe((unitAreaTypes: Choice[]) => {
        this.unitAreaTypes = unitAreaTypes;
      })
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}