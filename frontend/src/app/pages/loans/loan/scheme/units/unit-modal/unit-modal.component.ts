import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme} from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { pascalToTitle } from 'src/app/shared/utils';
import { APIResult } from 'src/app/_services/api-result';
import { AssetClassType, Hotel, Office, Residential, Retail, ShoppingCentre, StudentAccommodation, Unit } from '../../scheme.model';

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
  nextIsClicked = false;
  formIsSubmitted = false;
  numbersOnly = /^\d+$/;
  totalUnits = 0;
  totalArea = 0;

  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveAssetClass = new EventEmitter<AssetClassType | null>();

  assetClassesChoices: string[] = [];
  requiredControls: string[] = [];
  errors: string[] = [];
  invalidControlsType: { name: string, type: string }[] = [];
  subs: Subscription[] = [];
  assetClass = {} as AssetClassType;

  form: FormGroup = this.fb.group({
    assetClassTypeString: ['', Validators.required],
    units: this.fb.array([])
  })
  get assetClassTypeString() {
    return this.form.get('assetClassTypeString')
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
    const newUnit = new Unit(this.assetClass);

    return this.fb.group({
      id: [newUnit.id],
      label: [newUnit.label],
      description: ['', Validators.pattern(this.numbersOnly)],
      quantity: [null, [Validators.required, Validators.pattern(this.numbersOnly)]],
      beds: [null, Validators.pattern(this.numbersOnly)],
      areaSize: [null, Validators.pattern(this.numbersOnly)],
      areaType: [newUnit.areaType]
    })
  }

  assetClassHasBeds():boolean {
    const hasBeds = ['student accommodation', 'hotel', 'residential']
    return hasBeds.includes(this.assetClass.use.toLowerCase())
  }

  removeUnit(index: number) {
    this.units.removeAt(index);

    // if (this.units.length === 1) {
    //   this.units.at(0).get("description")!.patchValue("Total");
    // }
  }

  onCancel() {
    this.modalSaveAssetClass.emit();
  };

  onNext() {
    this.nextIsClicked = true;

    if(!!this.assetClassTypeString!.valid){
      
      this.step += 1;
      this.updateStatus();

      const assetClassType = this.assetClassTypeString!.value;
      this.assetClass = this.newAssetClass(assetClassType);

      this.addUnit();
    }

  }

  addUnit() {
    this.units.insert(0, this.newUnit());

    // if(this.units.length === 1){
    //   this.units.at(0).get("description")!.patchValue("Total");
    // };
    // if(this.units.length === 2){
    //   this.units.at(1).get("description")!.reset();
    // }

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

  newAssetClass(type:string): AssetClassType{

    const assetClassTypeMap: Record<string, new () => AssetClassType> = {
      "Hotel": Hotel,
      "Residential": Residential,
      "Retail": Retail,
      "Student Accommodation": StudentAccommodation,
      "Office": Office,
      "Shopping Centre": ShoppingCentre,
    };

    const AssetClass = assetClassTypeMap[type] || Residential;
    return new AssetClass();
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

    if (!this.form.valid) {
      return;
    }

    this.assetClass.schemeId = this.scheme.id;

    this._schemeService.createAssetClass(this.assetClass)
      .then((result:APIResult) => {
        let assetClassCreated = result.response as AssetClassType;
        this.units.controls.forEach(newUnit => {

          const unit: Unit = this.defineUnit(assetClassCreated, newUnit);

          // create an array of units
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

  defineUnit(assetClass:AssetClassType, newUnit:AbstractControl): Unit{
    const unit = new Unit(assetClass);
    unit.description = newUnit.get('description')!.value;
    unit.areaSize = newUnit.get('areaSize')!.value;
    unit.beds = newUnit.get('beds')!.value;
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
      return this.units.at(0).value.label
    } else if(controlName === "areaSize") {
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
    this.totalArea = 0;

    let totalUnits = 0;
    let totalArea = 0;
    this.units.controls.forEach(control => {
      totalUnits += +control.get('quantity')?.value || 0;
      totalArea += +control.get('areaSize')?.value || 0;
    });

    this.totalUnits += totalUnits;
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
          formattedChoices.push(pascalToTitle(choice))
        })

        this.assetClassesChoices = formattedChoices;
        this._schemeService.setAssetClassChoicesSub(formattedChoices); 
      })
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

}