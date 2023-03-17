import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';
@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.css']
})
export class UnitCardComponent implements OnInit {
  openUnitModal = false;
  modalMode = "";
  totalQuantity = 0;
  totalAreaSize = 0;

  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  @Output() deleteIsConfirmed = new EventEmitter<void>()
  unitStructure = {} as Unit | null;

  constructor(
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.unitStructure = new Unit(this.assetClass);
    this.getAssetClass();
    this.calculateTotals();
  }

  getAssetClass() {
    this._schemeService.getAssetClass(this.assetClass)
      .subscribe(assetClass => this.assetClass = assetClass)
  }

  onOpenUnitModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(assetClass: AssetClassType | null){
    this.openUnitModal = false;

    if(assetClass){
      this.assetClass = assetClass;
      this.calculateTotals();
    }
  }

  onDeleteAssetClass(){
    this.openUnitModal = false;
    this.deleteIsConfirmed.emit()
  }

  calculateTotals(){
    this.totalQuantity = this.assetClass.unitsGrouped.reduce((acc, unitsGroup) => acc + (+unitsGroup.quantity), 0)
    
    const totalAreaSizeCalc = this.assetClass.unitsGrouped.reduce((acc, unitsGroup) => acc + (+(unitsGroup.groupAreaSize ?? 0)), 0)
    this.totalAreaSize = +totalAreaSizeCalc.toFixed(2)
  }


}
