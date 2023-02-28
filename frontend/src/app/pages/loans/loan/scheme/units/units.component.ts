import { Component, Input, OnInit } from '@angular/core';
import { StringDictionary, StringUnitsDictionary } from 'src/app/shared/shared';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { AssetClass, Scheme, Unit } from '../scheme';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  openUnitModal = false;
  modalMode = "";
  assetClassChoices: StringDictionary = {};
  assetClassUnits = {} as StringUnitsDictionary;

  @Input() scheme = {} as Scheme

  constructor(
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void { }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(assetClass: AssetClass | null){
    this.openUnitModal = false;

    console.log("scheme", this.scheme);

    if(assetClass){
      this.scheme.assetClasses!.unshift(assetClass);
      
    }
  }



  // groupByAssetClass(units: Unit[]): StringUnitsDictionary{
  //   let dict = {} as StringUnitsDictionary;

  //     units.forEach(unit => {
  //       if(dict[unit.assetClass]){
  //         dict[unit.assetClass].push(unit)

  //       } else {
  //         dict[unit.assetClass] = [unit]
  //       }
  //     })

  //     return dict;
  // }

}
