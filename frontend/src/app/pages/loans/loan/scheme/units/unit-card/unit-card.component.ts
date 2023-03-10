import { Component, Input, OnInit } from '@angular/core';
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

  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit | null;

  constructor(
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.unitStructure = new Unit(this.assetClass);

    this.getAssetClass();
  }

  getAssetClass() {
    this._schemeService.getAssetClass(this.assetClass)
      .subscribe(assetClass => this.assetClass = assetClass)
  }

  onOpenUnitModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
    // console.log("this.scheme - unit card:", this.scheme)
  }

  onSave(assetClass: AssetClassType | null){
    this.openUnitModal = false;

    if(assetClass){
      this.assetClass = assetClass;
    }
  }

}
