import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';

import { toTitleCase } from 'src/app/shared/utils';

import { lastValueFrom } from 'rxjs';
import { Choice } from 'src/app/_interfaces/shared.interface';
import { AssetClassData, Scheme } from 'src/app/_interfaces/scheme.interface';
import { AssetClassType } from 'src/app/_types/custom.type';
import { AssetClassFactory } from 'src/app/_factories/scheme.factories';
import { APIResult } from 'src/app/_interfaces/api.interface';
import { SharedService } from 'src/app/_services/shared/shared.service';
import { Unit } from 'src/app/_interfaces/scheme.interface';

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
    // assetClassSubUse: new FormControl(''),
    investmentStrategy: new FormControl(''),
  });

  constructor(
    private el: ElementRef, 
    private _schemeService: SchemeService,
    private _sharedService: SharedService
    ) {}

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
    const choices$ = this._sharedService.getChoices(choiceType);
    const choices: Choice[] = await lastValueFrom(choices$);
    this.investmentStrategyChoices = choices;

    this.form.patchValue({
      investmentStrategy: this.investmentStrategyChoices[0].value,
    });
  }

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
      // subUse: this.form.value.assetClassSubUse,
      schemeId: this.scheme.id,
      investmentStrategy: this.form.value.investmentStrategy,
    };

    this._schemeService.createAssetClass(assetClass).then((res: APIResult) => {
      const assetClassRes: AssetClassType = res.response;
      this.modalSaveAssetClass.emit(assetClassRes);

    });
  }

  updateAssetClass(assetClass: AssetClassType) {
    assetClass.investmentStrategy = this.form.get("investmentStrategy")!.value;
    // assetClass.subUse = this.form.get("assetClassSubUse")?.value;

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

  populateForm() {
    this.form.setValue({
      assetClassUse: this.assetClass.use,
      // assetClassSubUse: this.assetClass.subUse,
      investmentStrategy: this.assetClass.investmentStrategy,
    });
  }

  onCancelDelete() {
    this.mode = 'edit';
  }

  getUseLabel(use: string){
    return this._sharedService.getChoiceLabel(use, this.useChoices);
  }

  getUseLabelTitleCase(use: string): string {
    const useLabel = this.getUseLabel(use);
    return toTitleCase(useLabel);
  }

}
