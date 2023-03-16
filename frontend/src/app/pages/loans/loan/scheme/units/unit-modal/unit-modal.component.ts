import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Scheme, UnitGroup} from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toTitleCase } from 'src/app/shared/utils';
import { APIResult } from 'src/app/_services/api-result';
import { AssetClassType, Hotel, Office, Residential, Retail, ShoppingCentre, StudentAccommodation, Unit } from '../../scheme.model';
// import { duplicateDescriptionValidator, duplicateValidatorFormArray } from 'src/app/shared/validators';
import { tap } from 'rxjs/operators';

interface RequestObject {
  unitsUpdated?: any;
  unitsCreated?: any;
  unitsDeleted?: any;
}

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
  @Output() deleteIsConfirmed = new EventEmitter<void>()

  @Input() availableAssetClassUses: string[] = [];
  @Input() assetClass = {} as AssetClassType;
  requiredControls: string[] = [];
  errors: string[] = [];
  subs: Subscription[] = [];
  emptyUnit = {} as Unit;
  mapFormIndexToUnitIds: { [key: number]: number[] } = {};


  form: FormGroup = this.fb.group({
    assetClassTypeString: ['', Validators.required],
    unitGroups: this.fb.array([], 
      {
      validators: [
        this.allDescriptionsDuplicateValidator(), 
        this.allRequiredValidator('description'),
        this.allRequiredValidator('quantity'),
        this.allPatternValidator('quantity'),
        this.allPatternValidator('beds'),
        this.allPatternValidator('areaSize')
      ], 
      // updateOn:'submit'
    }
      ) 
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
    this.subs.push(
      this.unitGroups.valueChanges.subscribe(() => {
        this.calculateTotals();
      })
    );

    if(this.mode==='edit' && !!this.assetClass.id){
      this.populateForm();
    }

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
    return this.fb.group({
      ids: this.fb.array([]),
      description: ["", Validators.required],
      quantity: [null, [Validators.required, Validators.pattern(this.numbersOnly)]],
      beds: [null, Validators.pattern(this.numbersOnly)],
      areaSize: [null, Validators.pattern(this.numbersOnly)],
    })
  }

  assetClassHasBeds():boolean {
    const hasBeds = ['student accommodation', 'hotel', 'residential']
    return hasBeds.includes(this.assetClass.use.toLowerCase())
  }

  removeUnitGroup(index: number) {
    this.unitGroups.removeAt(index);
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

    const newAssetClass = new AssetClass();
    newAssetClass.schemeId = this.scheme.id;

    return newAssetClass;
  }

  onPrevious() {
    this.formIsSubmitted = false;

    this.step -= 1;
    this.updateStatus();
    this.unitGroups.clear()
  }


  async onSave() {
    this.formIsSubmitted = true;

    if (!this.form.valid) {
      return;
    }

    this.assetClass = await this.getOrCreateAssetClass();

    const observables: Observable<any>[] = [];

    this.unitGroups.controls.forEach((unitGroup, index) => {

      const unitsToUpdate: Unit[] | undefined = this.defineUnitsToUpdate(unitGroup);
      const unitsToCreate: Unit[] | undefined = this.defineUnitsToCreate(unitGroup);
      const unitsToDelete: Unit[] | undefined = this.defineUnitsToDelete(unitGroup, unitsToUpdate);

      const updateUnitsReq = unitsToUpdate ? this._schemeService.updateUnits(unitsToUpdate) : undefined;
      const createUnitsReq = unitsToCreate ? this._schemeService.createUnits(unitsToCreate) : undefined;
      const deleteUnitsReq = unitsToDelete ? this._schemeService.deleteUnits(unitsToDelete) : undefined;

      const requestObj: any = {};
      if(!!updateUnitsReq){ requestObj.unitsUpdated = updateUnitsReq }
      if(!!createUnitsReq){ requestObj.unitsCreated = createUnitsReq }
      if(!!deleteUnitsReq){ requestObj.unitsDeleted = deleteUnitsReq }

      observables.push(forkJoin(requestObj).pipe(
        tap((results: any) => {
          const unitGrouped: UnitGroup = this.assetClass.unitsGrouped[index]

          unitGrouped.description = unitGroup.value.description;
          unitGrouped.areaSize = unitGroup.value.areaSize;
          unitGrouped.beds = unitGroup.value.beds;
          unitGrouped.quantity = unitGroup.value.quantity;
          
          this.assetClass.unitsGrouped[index] = unitGrouped;
        })
      ));
    });

    forkJoin(observables).subscribe(() => {
      this.modalSaveAssetClass.emit(this.assetClass);
    });

  }

  defineUnitsToUpdate(unitGroup: AbstractControl): Unit[] | undefined {
      const existingIds: number = unitGroup.value.ids?.length || 0;
      const groupQuantity: number = +unitGroup.value.quantity;
      const numberOfUnitsToUpdate: number = Math.min(groupQuantity, existingIds);

      if(numberOfUnitsToUpdate === 0){
        return undefined;
      }

      const unitsToUpdate: Unit[] = [];

      for (let i = 0; unitsToUpdate.length < numberOfUnitsToUpdate; i++) {
        let existingUnit: Unit | undefined= this.assetClass.units?.find((unit: Unit) => unit.id === unitGroup.value.ids[i]);

        if(!!existingUnit){
          existingUnit = this.setUnitParametres(existingUnit, unitGroup);
          unitsToUpdate.push(existingUnit)
        }
      }

      return unitsToUpdate;
    }
  
    defineUnitsToCreate(unitGroup: AbstractControl): Unit[] | undefined {
      const existingIds: number = unitGroup.value.ids?.length || 0;
      const groupQuantity: number = +unitGroup.value.quantity;
      const numberOfUnitsToCreate: number = Math.max(groupQuantity - existingIds, 0);

      if(numberOfUnitsToCreate === 0 ){ 
        return undefined
      }

      let newUnit: Unit = new Unit(this.assetClass);
      newUnit = this.setUnitParametres(newUnit, unitGroup);
  
      const newUnits: Unit[] = Array.from(
              {length: numberOfUnitsToCreate},
              () => newUnit
            );
      return newUnits;
    }

    setUnitParametres(unit: Unit, unitGroup:AbstractControl): Unit{
      unit.description = unitGroup.get('description')!.value;
      unit.areaSize = unitGroup.get('areaSize')!.value;
      unit.beds = unitGroup.get('beds')!.value;
      return unit;
    }

    defineUnitsToDelete(unitGroup: AbstractControl, unitsToUpdate: Unit[] | undefined): Unit[] | undefined {
      const existingIds: number = unitGroup.value.ids?.length || 0;
      const groupQuantity: number = +unitGroup.value.quantity;
      const numberOfUnitsToDelete: number = Math.max(existingIds - groupQuantity,0);

      if(numberOfUnitsToDelete === 0 ){ 
        return undefined 
      }

      const unitsToDelete: Unit[] | undefined = this.assetClass.units?.filter((unit: Unit) => (
        unitGroup.value.ids.includes(unit.id) && !unitsToUpdate?.includes(unit)
      ))

      return unitsToDelete;
    }

  
  
  async getOrCreateAssetClass(): Promise<AssetClassType>{
    if (this.assetClass.id) {
          return this.assetClass;
    }

    // Create a new asset class instance
    const result: APIResult = await this._schemeService.createAssetClass(this.assetClass);
    const assetClassCreated = result.response as AssetClassType;
    return assetClassCreated;
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
    
    this.unitGroups.clear();
    this.emptyUnit = new Unit(this.assetClass);

    this.assetClass.unitsGrouped.forEach((unitGroup: UnitGroup, index) => {
      this.unitGroups.push(
        this.fb.group({
          ids: this.getUnitGroupIds(unitGroup),
          description: [unitGroup.description, Validators.required],
          quantity: [unitGroup.quantity, [Validators.required, Validators.pattern(this.numbersOnly)]],
          beds: [unitGroup.beds, Validators.pattern(this.numbersOnly)],
          areaSize: [+unitGroup.areaSize!, Validators.pattern(this.numbersOnly)],
      }));

    });

  }

  getUnitGroupIds(unitGroup: UnitGroup): FormArray{
    // create an array of ids for all units part of this unitGroup
    const unitsByDescription = this.assetClass.units?.filter(unit => unit.description === unitGroup.description);
    const unitGroupIds: number[] = unitsByDescription?.map(unit => unit.id) as number[];

    // convert the array into a form array
    const idControls = unitGroupIds.map(id => new FormControl(id));
    const idFormArray = new FormArray(idControls);

    return idFormArray;
  }

  allDescriptionsDuplicateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) {
        return null;
      }
  
      const descriptions = control.value.map((unit: any) => unit.description);
      const hasDuplicates = descriptions.some((value: string, index: number) => descriptions.indexOf(value) !== index);

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

  allPatternValidator(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (!(control instanceof FormArray)) {
        return null;
      }

      const hasInvalidControl:boolean = control.controls.some((abstractControl: AbstractControl) => {
        const formGroup = abstractControl as FormGroup;
        const controlInstance = formGroup.get(controlName);
        return controlInstance?.hasError('pattern');
      })
      
      return hasInvalidControl ? { [`${controlName}Pattern`]: true } : null;
    };
  }

  onConfirmDelete(){
    this._schemeService.deleteAssetClass(this.assetClass)
      .subscribe(() =>  this.deleteIsConfirmed.emit())
  }


}