import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Scheme, UnitGroup} from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { toTitleCase } from 'src/app/shared/utils';
import { APIResult } from 'src/app/_services/api-result';
import { AssetClassType, Hotel, Office, Residential, Commercial, ShoppingCentre, StudentAccommodation, Unit } from '../../scheme.model';
import { tap } from 'rxjs/operators';

interface RequestObj {
  unitsUpdated?: APIResult;
  unitsCreated?: APIResult;
  unitsDeleted?: null;
}

interface ResponseObj {
  unitsUpdated?: APIResult;
  unitsCreated?: APIResult;
  unitsDeleted?: null;
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
  decimalsOnly = /^\d*\.?\d*$/;
  totalUnits = 0;
  totalArea = 0;

  @ViewChild('f') f!: NgForm;
  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Output() modalSaveAssetClass = new EventEmitter<AssetClassType | null>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  @Output() closeModal = new EventEmitter<void>();

  @Input() availableAssetClassUses: string[] = [];
  @Input() assetClass = {} as AssetClassType;
  requiredControls: string[] = [];
  errors: string[] = [];
  subs: Subscription[] = [];
  unitStructure = {} as Unit;
  mapFormIndexToUnitIds: { [key: number]: number[] } = {};
  unitsToDelete: Unit[] = [];


  form: FormGroup = this.fb.group({
    assetClassTypeString: ['', Validators.required],
    unitGroups: this.fb.array([], 
      {
      validators: [
        this.allDescriptionsDuplicateValidator(), 
        this.allRequiredValidator('description'),
        this.allRequiredValidator('quantity'),
        this.allPatternValidator('quantity'),
        this.allPatternValidator('groupBeds'),
        this.allPatternValidator('groupAreaSize')
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

    this.subs.push(
      this._schemeService.getAvailableAssetClassUsesSub()
        .subscribe((availableAssetClassUses:string[]) => this.availableAssetClassUses = availableAssetClassUses)
    )

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

    if (this.unitGroups.length === 1 && this.unitGroups.at(0).get("description")!.value === "-") {
      this.unitGroups.at(0).get("description")!.reset();
    }

    this.unitGroups.push(this.newUnitGroup());

    // allow description to be empty if there is only one unitGroup
    if (this.unitGroups.length === 1 && this.assetClass.use !== 'commercial') {
      this.unitGroups.at(0).get("description")!.patchValue("-");
    }
  }

  newUnitGroup(): FormGroup {
    return this.fb.group({
      ids: this.fb.array([]),
      description: ["", Validators.required],
      quantity: [null, [Validators.required, Validators.pattern(this.numbersOnly)]],
      bedsPerUnit: [null, Validators.pattern(this.numbersOnly)],
      groupAreaSize: [null, Validators.pattern(this.decimalsOnly)],
    })
  }

  assetClassHasBeds():boolean {
    const hasBeds = ['student accommodation', 'hotel', 'residential']
    return hasBeds.includes(this.assetClass.use.toLowerCase())
  }

  removeUnitGroup(index: number) {
    const unitsToDelete: Unit[] | undefined = this.unitGroupToExistingUnits(this.unitGroups.at(index));
    if(!!unitsToDelete) {
      this.unitsToDelete!.push(...unitsToDelete);
    };


    const assetClassUnitsGroupIndex = this.assetClass.unitsGrouped.findIndex((group) => group.description === this.unitGroups.at(index).value.description);
    this.assetClass.unitsGrouped.splice(assetClassUnitsGroupIndex, 1);

    this.unitGroups.removeAt(index);
   
  }

  onCancel() {
    this.modalSaveAssetClass.emit();
    this.unitsToDelete = [];
  };

  onNext() {
    this.nextIsClicked = true;

    if(!!this.assetClassTypeString!.valid){
      
      this.step += 1;
      this.updateStatus();

      if(this.mode === 'add'){
        const assetClassType = this.assetClassTypeString!.value;
        this.assetClass = this.newAssetClass(assetClassType);

        this.unitStructure = new Unit(this.assetClass);
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
      "Commercial": Commercial,
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
    const unitsResponse: Unit[] = [];

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

          console.log("results: ", results)

          const unitGrouped: UnitGroup = this.assetClass.unitsGrouped[index] || {};

          if(unitGroup.value.quantity === 0){
            // remove unitGrouped from assetClass
            this.assetClass.unitsGrouped.splice(index, 1);
          } else {
            unitGrouped.description = unitGroup.value.description;
            unitGrouped.quantity = unitGroup.value.quantity;
            unitGrouped.groupBeds = unitGroup.value.groupBeds; 
            unitGrouped.groupAreaSize = unitGroup.value.groupAreaSize;
            
            this.assetClass.unitsGrouped[index] = unitGrouped;
          }
          
        })
      ));
    });

    // to delete units which were in a unitGroup that was deleted
    if(this.unitsToDelete.length > 0 ){
      observables.push(this._schemeService.deleteUnits(this.unitsToDelete));
    }
    forkJoin(observables).subscribe((res) => {

      const unitsCreated: Unit[] = this.getUnitsResponse(res);
      unitsResponse.push(...unitsCreated);

      // const hasUnitsCreated = res.some(obj => obj?.unitsCreated !== undefined);
      // if(!!hasUnitsCreated){
      //   const unitsCreatedResponse: APIResult = res.find(obj => obj.hasOwnProperty('unitsCreated')).unitsCreated;
      //   const unitsCreated = unitsCreatedResponse.response as Unit[];
      //   unitsResponse.push(...unitsCreated);
      // };

      // const hasUnitsUpdated = res.some(obj => obj?.unitsUpdated !== undefined);
      // if(!!hasUnitsUpdated){
      //   const unitsUpdatedResponse: APIResult = res.find(obj => obj.hasOwnProperty('unitsUpdated')).unitsUpdated;
      //   const unitsUpdated = unitsUpdatedResponse.response as Unit[];
      //   unitsResponse.push(...unitsUpdated);
      // };
      // this.assetClass.units = unitsResponse;

      this.modalSaveAssetClass.emit(this.assetClass);
    });

  }

  getUnitsResponse(res:any): Unit[]{
    const units: Unit[] = [];

    const hasUnitsCreated = res.some((obj: any) => obj?.unitsCreated !== undefined);
      if(!!hasUnitsCreated){
        const unitsCreatedResponse: APIResult = res.find((obj: any) => obj.hasOwnProperty('unitsCreated')).unitsCreated;
        const unitsCreated = unitsCreatedResponse.response as Unit[];
        units.push(...unitsCreated);
      };

      const hasUnitsUpdated = res.some((obj: any) => obj?.unitsUpdated !== undefined);
      if(!!hasUnitsUpdated){
        const unitsUpdatedResponse: APIResult = res.find((obj: any) => obj.hasOwnProperty('unitsUpdated')).unitsUpdated;
        const unitsUpdated = unitsUpdatedResponse.response as Unit[];
        units.push(...unitsUpdated);
      };

    return units;
  }



  defineUnitsToUpdate(unitGroup: AbstractControl): Unit[] | undefined {
      const existingIds: number = unitGroup.value.ids?.length || 0;
      const quantity: number = +unitGroup.value.quantity;
      const numberOfUnitsToUpdate: number = Math.min(quantity, existingIds);

      if(numberOfUnitsToUpdate === 0){
        return undefined;
      }

      const unitsToUpdate: Unit[] = [];

      for (let i = 0; unitsToUpdate.length < numberOfUnitsToUpdate; i++) {
        let existingUnit: Unit | undefined= this.assetClass.units?.find((unit: Unit) => unit.id === unitGroup.value.ids[i]);

        if(!!existingUnit){
          existingUnit = this.setUnitParametres(existingUnit, unitGroup);
          unitsToUpdate.push(existingUnit);
          this.setAssetClassUnitGroupParametres(unitGroup);
        }
      }

      return unitsToUpdate;
    }

    setAssetClassUnitGroupParametres(unitGroup: AbstractControl){
      const unitGrouped: UnitGroup = {
        description: unitGroup.value.description,
        quantity: unitGroup.value.quantity,
        bedsPerUnit: unitGroup.value.bedsPerUnit,
        groupAreaSize: unitGroup.value.groupAreaSize
      }

      const assetClassUnitsGroupIndex = this.assetClass.unitsGrouped.findIndex((group) => group.description === unitGroup.value.description);

      if(assetClassUnitsGroupIndex === -1){
        this.assetClass.unitsGrouped.push(unitGrouped)
       } else {
        this.assetClass.unitsGrouped[assetClassUnitsGroupIndex] = unitGrouped;
       }
    }

  
    defineUnitsToCreate(unitGroup: AbstractControl): Unit[] | undefined {
      const existingIds: number = unitGroup.value.ids?.length || 0;
      const quantity: number = +unitGroup.value.quantity;
      const numberOfUnitsToCreate: number = Math.max(quantity - existingIds, 0);
      
      if(numberOfUnitsToCreate === 0 ){ 
        return undefined
      }

      let newUnit: Unit = new Unit(this.assetClass);
      newUnit = this.setUnitParametres(newUnit, unitGroup);
      this.setAssetClassUnitGroupParametres(unitGroup);

      const newUnits: Unit[] = Array.from(
              {length: numberOfUnitsToCreate},
              () => newUnit
            );
      return newUnits;
    }

    setUnitParametres(unit: Unit, unitGroup:AbstractControl): Unit{
      unit.description = unitGroup.get('description')!.value;

      let areaPerUnit = (unitGroup.get('groupAreaSize')?.value || 0) / unitGroup.get('quantity')!.value
      unit.areaSize = +areaPerUnit.toFixed(4);

      unit.beds = unitGroup.get('bedsPerUnit')!.value;
      return unit;
    }

    defineUnitsToDelete(unitGroup: AbstractControl, unitsToUpdate: Unit[] | undefined): Unit[] | undefined {
      const existingIds: number = unitGroup.value.ids?.length || 0;
      const quantity: number = +unitGroup.value.quantity;
      const numberOfUnitsToDelete: number = Math.max(existingIds - quantity,0);

      if(numberOfUnitsToDelete === 0 ){ 
        return undefined 
      }
      
      const unitsToDelete: Unit[] | undefined = this.assetClass.units?.filter((unit: Unit) => (
        unitGroup.value.ids.includes(unit.id) && !unitsToUpdate?.includes(unit)
      ))

      return unitsToDelete;
    }

    unitGroupToExistingUnits(unitGroup: AbstractControl): Unit[] | undefined {
      const units: Unit[]| undefined = this.assetClass.units?.filter((unit: Unit) => (
        unitGroup.value.ids.includes(unit.id)
      ));

      if (units?.length === 0) {
        return
      }

      return units;
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

  calculateTotals(): void {
    this.totalUnits = 0;
    this.totalArea = 0;

    let totalUnits = 0;
    let totalArea = 0;
    this.unitGroups.controls.forEach(control => {
      totalUnits += +control.get('quantity')?.value || 0;
      totalArea += +control.get('groupAreaSize')?.value || 0;
    });

    this.totalUnits += totalUnits;
    this.totalArea = +totalArea.toFixed(2);
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
    this.unitStructure = new Unit(this.assetClass);

    this.assetClass.unitsGrouped.forEach((unitGroup: UnitGroup, index) => {
      this.unitGroups.push(
        this.fb.group({
          ids: this.getUnitGroupIds(unitGroup),
          description: [unitGroup.description, Validators.required],
          quantity: [unitGroup.quantity, [Validators.required, Validators.pattern(this.numbersOnly)]],
          bedsPerUnit: [unitGroup.bedsPerUnit , Validators.pattern(this.numbersOnly)],
          groupAreaSize: [+unitGroup.groupAreaSize, Validators.pattern(this.decimalsOnly)],
      }));
    });

    if(this.unitGroups.length === 0){
      this.addUnitGroup();
    };
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