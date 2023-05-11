import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Scheme } from '../../scheme';
import {
  AssetClassFactory,
  AssetClassType,
  Commercial,
  Hotel,
  Office,
  Residential,
  ShoppingCentre,
  StudentAccommodation,
} from '../../scheme.model';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { APIResult } from 'src/app/_services/api-result';
import { toTitleCase } from 'src/app/shared/utils';
import { Choice } from 'src/app/shared/shared';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-asset-class-modal',
  templateUrl: './asset-class-modal.component.html',
  styleUrls: ['./asset-class-modal.component.css'],
})
export class AssetClassModalComponent implements OnInit {
  openAssetClassModal = false;
  displayStyle = 'block';
  chevronRight = 'assets/images/chevronRight.svg';
  assetClassStatus = 'active';
  investmentStartegyStatus = 'inactive';
  step = 1;
  investmentStrategyChoices: Choice[] = [];
  nextIsClicked = false;
  @Input() availableUseChoices: Choice[] = [];
  @Input() useChoices: Choice[] = [];
  @Input() mode = '';
  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  @Output() modalSaveAssetClass = new EventEmitter<AssetClassType | null>();
  @Output() deleteIsConfirmed = new EventEmitter<void>();

  form: FormGroup = new FormGroup({
    assetClassUse: new FormControl('', [Validators.required]),
    investmentStrategy: new FormControl(''),
  });

  constructor(private el: ElementRef, private _schemeService: SchemeService) {}

  async ngOnInit(): Promise<void> {
    this.addEventBackgroundClose();
    await this.getChoices('investmentStrategy');
    // this.getInvestmentStrategyChoices();
    if (this.mode === 'edit') {
      this.populateForm();
    }
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  }

  onCancel() {
    this.modalSaveAssetClass.emit();
  }

  async getChoices(choiceType: string) {
    const choices$ = this._schemeService.getChoices(choiceType);
    const choices: Choice[] = await lastValueFrom(choices$);
    this.investmentStrategyChoices = choices;

    this.form.patchValue({
      investmentStrategy: this.investmentStrategyChoices[0].value,
    });

    // this._schemeService.getChoices(choiceType).subscribe((choices: Choice[]) => {
    //   this.investmentStrategyChoices = choices;
    //   this.form.patchValue({
    //     investmentStrategy: this.investmentStrategyChoices[0].value,
    //   });
      // console.log(saleStatusChoices)
      // async and await and set the value of the form control
    // });
  }

  // getInvestmentStrategyChoices() {
  //   this._schemeService.getChoices('investment_strategy').subscribe((choices: Choice[]) => {
  //     this.investmentStrategyChoices = choices;
  //   })
  // }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    if (this.mode === 'edit') {
      this.updateAssetClass(this.assetClass);
    } else {
      this.createAssetClass();
    }
  }

  createAssetClass() {
    const use = this.form.value.assetClassUse;
    const factory = new AssetClassFactory(this.scheme);
    let assetClass = factory.defineAssetClass(use);

    assetClass = {
      ...assetClass,
      schemeId: this.scheme.id,
      investmentStrategy: this.form.value.investmentStrategy,
    };

    this._schemeService.createAssetClass(assetClass).then((res: APIResult) => {
      const assetClassRes: AssetClassType = res.response;
      this.modalSaveAssetClass.emit(assetClassRes);
    });
  }

  updateAssetClass(assetClass: AssetClassType) {
    assetClass.investmentStrategy = this.form.value.investmentStrategy;

    this._schemeService.updateAssetClass(assetClass).then((res: APIResult) => {
      const assetClassRes: AssetClassType = res.response;
      this.modalSaveAssetClass.emit(assetClassRes);
    });
  }

  onConfirmDelete() {
    this._schemeService.deleteAssetClass(this.assetClass).subscribe(() => this.deleteIsConfirmed.emit());
  }

  onNext() {
    this.nextIsClicked = true;
    if (this.formIsValid()) {
      this.step++;
      this.updateStatus();
    }
  }

  formIsValid(): boolean {
    if (this.step === 1) {
      return this.form.get('assetClassUse')!.valid;
    } else if (this.step === 2) {
      return this.form.get('investmentStrategy')!.valid && this.form.get('assetClassUse')!.valid;
    } else {
      return this.form.valid;
    }
  }

  onPrevious() {
    this.nextIsClicked = false;
    this.step--;
    this.updateStatus();
  }

  updateStatus() {
    if (this.step === 1) {
      this.assetClassStatus = 'active';
      this.investmentStartegyStatus = 'inactive';
    } else {
      this.assetClassStatus = 'complete';
      this.investmentStartegyStatus = 'active';
    }
  }

  // allDescriptionsDuplicateValidator(): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     if (!(control instanceof FormArray)) {
  //       return null;
  //     }

  //     const descriptions = control.value.map((unit: any) => unit.description);
  //     const hasDuplicates = descriptions.some((value: string, index: number) => descriptions.indexOf(value) !== index);
  //     return hasDuplicates ? { duplicateDescription: true } : null;
  //   };
  // };

  // allRequiredValidator(controlName: string): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {

  //     if (!(control instanceof FormArray)) {
  //       return null;
  //     }

  //     const hasEmptyControl:boolean = control.controls.some((abstractControl: AbstractControl) => {
  //       const formGroup = abstractControl as FormGroup;
  //       const controlInstance = formGroup.get(controlName);
  //       return controlInstance?.value === undefined || controlInstance.value === null || controlInstance.value === "" || controlInstance.value === 0;
  //     })

  //     return hasEmptyControl ? { [`${controlName}Required`]: true } : null;
  //   };
  // };

  // allPatternValidator(controlName: string): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {

  //     if (!(control instanceof FormArray)) {
  //       return null;
  //     }

  //     const hasInvalidControl:boolean = control.controls.some((abstractControl: AbstractControl) => {
  //       const formGroup = abstractControl as FormGroup;
  //       const controlInstance = formGroup.get(controlName);
  //       return controlInstance?.hasError('pattern');
  //     })

  //     return hasInvalidControl ? { [`${controlName}Pattern`]: true } : null;
  //   };
  // };

  populateForm() {
    this.form.setValue({
      assetClassUse: this.assetClass.use,
      investmentStrategy: this.assetClass.investmentStrategy,
    });
  }

  onCancelDelete() {
    this.mode = 'edit';
  }

  getUseLabelTitleCase(use: string): string {
    const useLabel = this._schemeService.getChoiceLabel(use, this.useChoices)
    return toTitleCase(useLabel);
  }
}
