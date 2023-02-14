import { Component, Input, OnInit } from '@angular/core';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { AssetClassMap, Scheme, Unit } from '../scheme';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  openUnitModal = false;
  modalMode = "";
  assetClassMap = {} as AssetClassMap;

  @Input() scheme = {} as Scheme

  constructor(
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    this.getAssetClassMap();
   }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(units: Unit[] | null){
    this.openUnitModal = false;

    console.log("new units:", units)

    if(units){
      this.scheme.units!.concat(units);
    }
  }

  getAssetClassMap(){
    this._schemeService.getAssetClassMap()
      .subscribe(assetClassMap => {
        this.assetClassMap = assetClassMap;
        // console.log("assetClassMap:", this.assetClassMap)
      })
  } 

}
