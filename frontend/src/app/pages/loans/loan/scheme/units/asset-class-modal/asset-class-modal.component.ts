import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheme } from '../../scheme';
import { AssetClassType, Commercial, Hotel, Office, Residential, ShoppingCentre, StudentAccommodation } from '../../scheme.model';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { APIResult } from 'src/app/_services/api-result';
import { toTitleCase } from 'src/app/shared/utils';

@Component({
  selector: 'app-asset-class-modal',
  templateUrl: './asset-class-modal.component.html',
  styleUrls: ['./asset-class-modal.component.css']
})
export class AssetClassModalComponent implements OnInit {
  displayStyle = "block";
  chevronRight = "assets/images/chevronRight.svg";
  assetClassStatus = "active";
  investmentStartegyStatus = "inactive";
  step = 1;
  nextIsClicked = false;
  @Input() availableAssetClassUses: string[] = [];
  @Input() mode = "";
  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  @Output() modalSaveAssetClass = new EventEmitter<AssetClassType | null>();
  @Output() deleteIsConfirmed = new EventEmitter<void>()

  form: FormGroup = new FormGroup({
    assetClass: new FormControl('', [Validators.required]),
    investmentStrategy: new FormControl('buildToSell')
  });

  constructor(
    private el: ElementRef,
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();

    if(this.mode==='edit' && !!this.assetClass.id){
      this.populateForm();
    }

  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  onCancel() {
    this.modalSaveAssetClass.emit();
  };

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    if(this.mode === 'edit' && !!this.assetClass.id){
      this.updateAssetClass(this.assetClass);
    } else {
      this.createAssetClass();
    }
  }

  createAssetClass(){
    const assetClass:AssetClassType = this.newAssetClass(this.form.value.assetClass);
    assetClass.schemeId = this.scheme.id;

    this._schemeService.createAssetClass(assetClass)
      .then((res:APIResult) => {
        const assetClassRes:AssetClassType = res.response;
        this.modalSaveAssetClass.emit(assetClassRes);
      })
  }

  updateAssetClass(assetClass: AssetClassType){
    assetClass.investmentStrategy = this.form.value.investmentStrategy;

    this._schemeService.updateAssetClass(assetClass)
      .then((res:APIResult) => {
        const assetClassRes:AssetClassType = res.response;
        this.modalSaveAssetClass.emit(assetClassRes);
      })
  }

  onConfirmDelete(){
    this._schemeService.deleteAssetClass(this.assetClass)
      .subscribe(() =>  this.deleteIsConfirmed.emit())
  }

  newAssetClass(type:string): AssetClassType{
    switch(type){
      case "Hotel":
        return new Hotel(this.scheme.id);
      case "Residential":
        return new Residential(this.scheme.id);
      case "Commercial":
        return new Commercial(this.scheme.id);
      case "Student Accommodation":
        return new StudentAccommodation(this.scheme.id);
      case "Office":
        return new Office(this.scheme.id);
      case "Shopping Centre":
        return new ShoppingCentre(this.scheme.id);

      default:
        return new Residential(this.scheme.id);
    }
  }

  onNext() {
    this.nextIsClicked = true;
    if(this.formIsValid()){
      this.step++;
      this.updateStatus();
    }
  }

  formIsValid():boolean {
    if(this.step === 1){
      return this.form.get('assetClass')!.valid;
    } else if(this.step === 2){
      return this.form.get('investmentStrategy')!.valid && this.form.get('assetClass')!.valid ;
    } else {
      return this.form.valid;
    }
  }

  onPrevious() {
    this.nextIsClicked = false;
    this.step--;
    this.updateStatus();
  }

  updateStatus(){
    if(this.step===1){
      this.assetClassStatus = "active";
      this.investmentStartegyStatus = "inactive";
    } else {
      this.assetClassStatus = "complete";
      this.investmentStartegyStatus = "active";
    }
  };

  allDescriptionsDuplicateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormArray)) {
        return null;
      }
  
      const descriptions = control.value.map((unit: any) => unit.description);
      const hasDuplicates = descriptions.some((value: string, index: number) => descriptions.indexOf(value) !== index);
      return hasDuplicates ? { duplicateDescription: true } : null;
    };
  };

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
  };

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
  };

  populateForm(){
    this.form.patchValue({
      assetClass: toTitleCase(this.assetClass.use),
      investmentStrategy: this.assetClass.investmentStrategy
    });
  }


}
