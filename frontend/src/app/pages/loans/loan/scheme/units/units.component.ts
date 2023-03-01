import { Component, Input, OnInit } from '@angular/core';
import { StringDictionary, StringUnitsDictionary } from 'src/app/shared/shared';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { AssetClass, Hotel, Office, Residential, Retail, Scheme, ShoppingCentre, StudentAccommodation, Unit } from '../scheme';

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

  onSave(assetClass: Hotel |
                     Residential | 
                     Retail | 
                     StudentAccommodation | 
                     Office | 
                     ShoppingCentre | 
                     null){

    this.openUnitModal = false;

    console.log("scheme", this.scheme);

    if(assetClass){
      this.scheme.assetClasses!.unshift(assetClass);
      
    }
  }

  // getType(assetClass: Hotel |
  //                       Residential | 
  //                       Retail | 
  //                       StudentAccommodation | 
  //                       Office | 
  //                       ShoppingCentre): string{
  //     switch (true) {
  //       case assetClass instanceof Hotel:
  //         return 'Hotel';
  //       case assetClass instanceof Residential:
  //         return 'Residential';
  //       case assetClass instanceof Retail:
  //         return 'Retail';
  //       case assetClass instanceof StudentAccommodation:
  //         return 'Student Accommodation';
  //       case assetClass instanceof Office:
  //         return 'Office';
  //       case assetClass instanceof ShoppingCentre:
  //         return 'Shopping Centre';
  //       default:
  //         return 'Unknown';
  //     }
  // }



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
