import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AssetClassType } from '../../scheme.model';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { APIResult } from 'src/app/_services/api-result';

@Component({
  selector: 'app-strategy-modal',
  templateUrl: './strategy-modal.component.html'
})
export class StrategyModalComponent implements OnInit {
  displayStyle = "block";
  @Input() assetClass = {} as AssetClassType;
  @Input() mode = "";
  @Output() modalAssetClassUpdate = new EventEmitter<AssetClassType | undefined>();

  form: FormGroup = new FormGroup({
    investmentStrategy: new FormControl('buildToSell'),
  })
  constructor(
    private el: ElementRef,
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.addEventBackgroundClose();
    this.initForm();
  }

  addEventBackgroundClose() {
    this.el.nativeElement.addEventListener('click', (el: any) => {
      if (el.target.className === 'modal') {
        this.onCancel();
      }
    });
  };

  onCancel() {
    this.modalAssetClassUpdate.emit();
  };

  onSave(){
    if (!this.form.valid) {
      return;
    }

    const investmentStrategy: string = this.form.get('investmentStrategy')?.value || "";
    this.assetClass.investmentStrategy = investmentStrategy;

    this._schemeService.updateAssetClass(this.assetClass)
     .then((res: APIResult) => {
      const assetClass = res.response as AssetClassType;
      this.modalAssetClassUpdate.emit(assetClass);
     })
     .catch(err => console.log(err));
  }

  initForm(){
    if(this.assetClass.investmentStrategy){
      this.form.get('investmentStrategy')?.setValue(this.assetClass.investmentStrategy);
    }
  }

}
