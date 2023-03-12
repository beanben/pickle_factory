import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Scheme} from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toTitleCase } from 'src/app/shared/utils';
import { APIResult } from 'src/app/_services/api-result';
import { AssetClassType, Hotel, Office, Residential, Retail, ShoppingCentre, StudentAccommodation, Unit } from '../../scheme.model';
// import { duplicateDescriptionValidator, duplicateValidatorFormArray } from 'src/app/shared/validators';

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

  @ViewChild('f') f!: NgForm;
  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveAssetClass = new EventEmitter<AssetClassType | null>();

  @Input() availableAssetClassUses: string[] = [];
  requiredControls: string[] = [];
  errors: string[] = [];
  // invalidControlsType: { name: string, type: string }[] = [];
  subs: Subscription[] = [];
  @Input() assetClass = {} as AssetClassType;
  emptyUnit = {} as Unit;
  mapFormIndexToExistingUnits: { [key: number]: Unit[] } = {};


  form: FormGroup = this.fb.group({
    assetClassTypeString: ['', Validators.required],
    unitGroups: this.fb.array([], {
      validators: [
        this.allDescriptionsDuplicateValidator(), 
        this.allRequiredValidator('description'),
        this.allRequiredValidator('quantity'),
        this.allNumbersOnlyValidator('quantity'),
        this.allNumbersOnlyValidator('beds'),
        this.allNumbersOnlyValidator('areaSize')
      ], 
      updateOn:'submit'}) // updateOn:'submit' does not work - validation trigger on everychange. Not sure how to make this work.
  })
  get assetClassTypeString() {
    return this.form.get('assetClassTypeString')
  };
  get unitGroups(): FormArray {
    return this.form.get("unitGroups") as FormArray
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
      this.unitGroups.valueChanges.subscribe(() => {
        this.calculateTotals();
        // this.formIsSubmitted ? this.getInvalidControls(): null ;
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

  addUnitGroup() {
    this.formIsSubmitted = false;
    
    if (this.unitGroups.length === 1) {
      this.unitGroups.at(0).get("description")!.reset();
    }

    this.unitGroups.push(this.newUnitGroup());

    // allow description to be emtpy if there is only one unitGroup
    if (this.unitGroups.length === 1) {
      this.unitGroups.at(0).get("description")!.patchValue("-");
    }
  }

  newUnitGroup(): FormGroup {
    const unitGroup: Unit = this.emptyUnit;

    return this.fb.group({
      label: [unitGroup.label],
      description: [unitGroup.description, Validators.required],
      quantity: [unitGroup.quantity, [Validators.required, Validators.pattern(this.numbersOnly)]],
      beds: [unitGroup.beds, Validators.pattern(this.numbersOnly)],
      areaSize: [unitGroup.areaSize, Validators.pattern(this.numbersOnly)],
      // areaType: [unitGroup.areaType]
    })
  }

  assetClassHasBeds():boolean {
    const hasBeds = ['student accommodation', 'hotel', 'residential']
    return hasBeds.includes(this.assetClass.use.toLowerCase())
  }

  removeUnitGroup(index: number) {
    this.unitGroups.removeAt(index);

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

        this.emptyUnit = new Unit(this.assetClass);
        this.addUnitGroup();
      };

      console.log("this.form.value:", this.form.value)
    }

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
    this.unitGroups.clear()
  }

  onSave() {
    this.formIsSubmitted = true;
    // this.getInvalidControls();

    console.log("inside save")
    

    // if (!this.form.valid) {
    //   return;
    // }

    // this.assetClass.schemeId = this.scheme.id;

    // // check if asset class already exists, if not create it - THIS WILL HAVE TO BE AMENDED FOR RETAIL
    // const existingAssetClass: AssetClassType | undefined = this.scheme.assetClasses.find(
    //   (assetClass: AssetClassType) => assetClass.use === this.assetClass.use
    // );

    // if (existingAssetClass) {
    //   this.unitGroups.controls.forEach((unitGroup, index) => {

    //     const unitCategory: Unit = this.defineUnit(existingAssetClass, unitGroup);

    //     // create an array of units
    //     const units: Unit[] = Array.from(
    //       {length: unitGroup.get('quantity')!.value},
    //       () => unitCategory
    //     );

    //     this._schemeService.createUnits(units)
    //       .then((result:APIResult) => {
    //         const unitsCreated: Unit[] = result.response;
    //         existingAssetClass.units = unitsCreated;

    //         this.modalSaveAssetClass.emit(existingAssetClass);
    //       })

    //   })
      
    // } else {
    //   this._schemeService.createAssetClass(this.assetClass)
    //   .then((result:APIResult) => {
    //     let assetClassCreated = result.response as AssetClassType;

    //     this.unitGroups.controls.forEach(unitGroup => {

    //       const unitCategory: Unit = this.defineUnit(assetClassCreated, unitGroup);

    //       // create an array of units
    //       const units: Unit[] = Array.from(
    //         {length: unitGroup.get('quantity')!.value},
    //         () => unitCategory
    //       );
          
    //       this._schemeService.createUnits(units)
    //         .then((result:APIResult) => {
    //           const unitsCreated: Unit[] = result.response;
    //           assetClassCreated.units = unitsCreated;

    //           this.modalSaveAssetClass.emit(assetClassCreated);

    //         })
    //     })
    //   })

    // }

  }

  defineUnit(assetClass:AssetClassType, unitGroup:AbstractControl): Unit{
    const unit = new Unit(assetClass);
    unit.description = unitGroup.get('description')!.value;
    unit.areaSize = unitGroup.get('areaSize')!.value;
    unit.beds = unitGroup.get('beds')!.value;
    return unit;
  }

  controlLabels(controlName: string): string{
    if(controlName === "quantity"){
      return this.unitGroups.at(0).value.label
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
    this.unitGroups.controls.forEach(control => {
      totalUnits += +control.get('quantity')?.value || 0;
      totalArea += +control.get('areaSize')?.value || 0;
    });

    this.totalUnits += totalUnits;
    this.totalArea += totalArea;
  }


  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe())
  }


  populateForm() {
    // update value of assetClassTypeString
    this.form.controls['assetClassTypeString'].setValue(
      toTitleCase(this.assetClass.use)
    );
    
    // to make sure form showing unitGrops is correct
    this.emptyUnit = new Unit(this.assetClass);

    // update units
    this.unitGroups.clear();

    let index = 0;
    this.assetClass.unitsGrouped.forEach((unitGroup: Unit) => {
      this.unitGroups.push(
        this.fb.group({
          // isNew: false,
          description: [unitGroup.description, Validators.required],
          quantity: [unitGroup.quantity, [Validators.required, Validators.pattern(this.numbersOnly)]],
          beds: [unitGroup.beds, Validators.pattern(this.numbersOnly)],
          areaSize: [+unitGroup.areaSize!, Validators.pattern(this.numbersOnly)],
        }  )
      );

      // group units by description
      const unitByDescription: Unit[] = this.assetClass.unitsGrouped.filter(unit => unit.description === unitGroup.description);
      this.mapFormIndexToExistingUnits[index] = unitByDescription;

      index++;
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

  allDescriptionsDuplicateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) {
        return null;
      }
  
      const descriptions = control.value.map((unit: any) => unit.description);
      const hasDuplicates = descriptions.some((value: string, index: number) => descriptions.indexOf(value) !== index);

      // // set the error on the relevant 'description' formControls
      // if(hasDuplicates){
      //   // get the duplicated descriptions
      //   const duplicatedDescriptions: string[] = [];
      //   const uniqueDescriptions: string[]= []
      //   descriptions.forEach((description:string) => {

      //     if(!uniqueDescriptions.includes(description)){
      //       uniqueDescriptions.push(description)
      //     } else if (!duplicatedDescriptions.includes(description)) {
      //       duplicatedDescriptions.push(description)
      //     }
      //   });

      //   // identify the formcontrols with the duplicated descriptions and set the error
      //   control.controls.forEach(unitGroup => {
      //     const description = unitGroup.get('description') as FormControl;
      //     if(duplicatedDescriptions.includes(description.value)){
      //       description.setErrors({ duplicateDescription: true });
      //     }
      //   })
      // }


      return hasDuplicates ? { duplicateDescription: true } : null;
    };
  }

  allRequiredValidator(controlName: string): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      if (!(control instanceof FormArray)) {
        return null;
      }

      const hasEmptyControl:boolean = control.controls.some((abstractControl: AbstractControl) => {
        const formGroup = abstractControl as FormGroup;
        const controlInstance = formGroup.get(controlName);
        return controlInstance?.value === undefined || controlInstance.value === null || controlInstance.value === "" || controlInstance.value === 0; 
      })
      
      return hasEmptyControl ? { [`${controlName}Required`]: true } : null;
    };
  }

  allNumbersOnlyValidator(controlName: string): ValidatorFn {
    const numbersOnly = /^\d+$/;
    
    return (control: AbstractControl): ValidationErrors | null => {

      if (!(control instanceof FormArray)) {
        return null;
      }

      const hasInvalidControl:boolean = control.controls.some((abstractControl: AbstractControl) => {
        const formGroup = abstractControl as FormGroup;
        const controlInstance = formGroup.get(controlName);
        return controlInstance?.hasError('pattern');
      })
      
      return hasInvalidControl ? { [`${controlName}Number`]: true } : null;
    };
  }


}