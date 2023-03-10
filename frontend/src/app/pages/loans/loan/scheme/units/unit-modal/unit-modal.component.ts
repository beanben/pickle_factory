import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme} from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toTitleCase } from 'src/app/shared/utils';
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
  unitStatus = "inactive";
  step = 1;
  nextIsClicked = false;
  formIsSubmitted = false;
  numbersOnly = /^\d+$/;
  totalUnits = 0;
  totalArea = 0;

  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveAssetClass = new EventEmitter<AssetClassType | null>();

  @Input() availableAssetClassUses: string[] = [];
  requiredControls: string[] = [];
  errors: string[] = [];
  invalidControlsType: { name: string, type: string }[] = [];
  subs: Subscription[] = [];
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit;
  mapFormIndexToExistingUnits: { [key: number]: Unit[] } = {};

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
    // this.getAssetClassesUseChoices();
    // this.initForm();

    this.subs.push(
      this.units.valueChanges.subscribe(() => {
        this.calculateTotals();
        this.formIsSubmitted ? this.getInvalidControls(): null ;
      })
    );

    if(this.mode==='edit' && !!this.assetClass.id){
      this.populateForm();
    }

    // console.log("assetClass:", this.assetClass)

  };

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  newUnit(): FormGroup {
    const newUnit = this.unitStructure;

    return this.fb.group({
      id: [newUnit.id],
      label: [newUnit.label],
      description: [''],
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

      if(this.mode === 'add'){
        const assetClassType = this.assetClassTypeString!.value;
        this.assetClass = this.newAssetClass(assetClassType);
        this.addUnit();
      };

      this.unitStructure = new Unit(this.assetClass);
      console.log("this.form.value:", this.form.value)
    }

  }

  addUnit() {
    this.units.insert(0, this.newUnit());
  }

  updateStatus(){
    if(this.step===1){
      this.assetClassStatus = "active";
      this.unitStatus = "inactive";
    } else {
      this.assetClassStatus = "complete";
      this.unitStatus = "active";
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

    // check if asset class already exists, if not create it - THIS WILL HAVE TO BE AMENDED FOR RETAIL
    const existingAssetClass: AssetClassType | undefined = this.scheme.assetClasses.find(
      (assetClass: AssetClassType) => assetClass.use === this.assetClass.use
    );

    if (existingAssetClass) {
      this.units.controls.forEach((unitGroup, index) => {

        const unitCategory: Unit = this.defineUnit(existingAssetClass, unitGroup);

        // const number_of_existing_units: number = this.mapDescriptionToExistingUnits['description'].length
        // const number_of_new_units = unitGroup.get('quantity')!.value - number_of_existing_units;

        // const formIndex = unitGroup.get('id')!.value;

        // create an array of units
        const units: Unit[] = Array.from(
          {length: unitGroup.get('quantity')!.value},
          () => unitCategory
        );

        this._schemeService.createUnits(units)
          .then((result:APIResult) => {
            const unitsCreated: Unit[] = result.response;
            existingAssetClass.units = unitsCreated;

            this.modalSaveAssetClass.emit(existingAssetClass);
          })

      })
      
    } else {
      this._schemeService.createAssetClass(this.assetClass)
      .then((result:APIResult) => {
        let assetClassCreated = result.response as AssetClassType;

        this.units.controls.forEach(newUnit => {

          const unitCategory: Unit = this.defineUnit(assetClassCreated, newUnit);

          // create an array of units
          const units: Unit[] = Array.from(
            {length: newUnit.get('quantity')!.value},
            () => unitCategory
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

  }

  defineUnit(assetClass:AssetClassType, unitGroup:AbstractControl): Unit{
    const unit = new Unit(assetClass);
    unit.description = unitGroup.get('description')!.value;
    unit.areaSize = unitGroup.get('areaSize')!.value;
    unit.beds = unitGroup.get('beds')!.value;
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

  // getAssetClassesUseChoices(){
  //   const assetClassUseChoicesSub: string[] = this._schemeService.assetClassUseChoicesSub.getValue();


  //   this.assetClassUseChoices = assetClassUseChoicesSub;


  //   if(this.assetClassUseChoices.length === 0){
  //     this.getReqAssetClassUseChoices()
  //   }

  // }


  // getReqAssetClassUseChoices(){
  //   this._schemeService.getAssetClassUseChoices()
  //     .subscribe((res: string[]) => {

  //       const formattedUseChoices: string[] = [];
  //       res.forEach(choice => {
  //         formattedUseChoices.push(pascalToTitle(choice))
  //       })

  //       const existingSchemeUses: string[] = this.scheme.assetClasses.map(assetClass => assetClass.use);
  //       const availableSchemeUses: string[] = formattedUseChoices.filter(
  //         assetClassUse => !existingSchemeUses.includes(assetClassUse.toLowerCase())
  //       );

  //       this.assetClassUseChoices = availableSchemeUses;
  //       this._schemeService.setAssetClassUseChoicesSub(availableSchemeUses); 
  //     })
  // }

  // getAvailableAssetClasses(){

  //   this._schemeService.getAvailableAssetClasses(this.scheme)
  //     .subscribe((res: string[]) => {
  //       console.log("res:", res)
  //     })  
      
  // }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  // initForm() {
  //   const assetClassTypeString: string| null = this.assetClass.use;

  //   console.log("assetClassTypeString", assetClassTypeString)

  //   if(assetClassTypeString){
  //     this.form.controls['assetClassTypeString'].setValue(
  //       toTitleCase(assetClassTypeString)
  //       )
  //   }
  // }

  // compareFn(choice1: string, choice2: string): boolean {
  //   return choice1 === choice2;
  // }

  populateForm() {
    // update value of assetClassTypeString
    this.form.controls['assetClassTypeString'].setValue(
      toTitleCase(this.assetClass.use)
    );
    // this.assetClassTypeString!.disable()

    // update units
    this.units.clear();

    // console.log("this.assetClass: ", this.assetClass)
    let index = 0;
    this.assetClass.unitsGrouped.forEach((unitGroup: Unit) => {
      this.units.push(
        this.fb.group({
          id: index,
          description: [unitGroup.description],
          quantity: [unitGroup.quantity, [Validators.required, Validators.pattern(this.numbersOnly)]],
          beds: [unitGroup.beds, Validators.pattern(this.numbersOnly)],
          areaSize: [unitGroup.areaSize, Validators.pattern(this.numbersOnly)],
        })
      );
      index++;

      // group units by description
      const unitByDescription: Unit[] = this.assetClass.unitsGrouped.filter(unit => unit.description === unitGroup.description);
      this.mapFormIndexToExistingUnits[index] = unitByDescription;
      // create a map of description to existing units
      // this.assetClass.units!.forEach(unit => {
      //   const description = unit.description || "";

      //   if (!this.mapDescriptionToExistingUnits[description]) {
      //     this.mapDescriptionToExistingUnits[description] = [];
      //   };
      //   this.mapDescriptionToExistingUnits[description].push(unit);
      // });

    });

    // console.log("this.mapDescriptionToExistingUnits:", this.mapDescriptionToExistingUnits)
  }


}