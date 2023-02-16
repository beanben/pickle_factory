import { Component, Input, OnInit } from '@angular/core';
import { StringDictionary, StringUnitsDictionary } from 'src/app/shared/shared';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Scheme, Unit } from '../scheme';

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

  ngOnInit(): void {
    this.getAssetClassChoices();

    if(this.scheme.units){
      this.assetClassUnits = this.groupByAssetClass(this.scheme.units!);
    }
    
   }

  onOpenModal(modalMode: string){
    this.openUnitModal = true;
    this.modalMode = modalMode;
  }

  onSave(units: Unit[] | null){
    this.openUnitModal = false;

    

    if(units){
      // this.scheme.units = this.scheme.units!.concat(units);
      this.scheme.units!.unshift(...units);

    }
  }

  getAssetClassChoices(){
    let dict = {} as StringDictionary;
    dict = this._schemeService.assetClassChoicesSub.getValue();

    if(Object.keys(dict).length === 0) {
      this._schemeService.getAssetClassChoices()
        .subscribe(assetClassChoices => {

          this.assetClassChoices = assetClassChoices;
          this._schemeService.setAssetClassChoicesSub(assetClassChoices);

        })
    } else {
      this.assetClassChoices = dict;
    }
  }

  groupByAssetClass(units: Unit[]): StringUnitsDictionary{
    let dict = {} as StringUnitsDictionary;

      units.forEach(unit => {
        if(dict[unit.assetClass]){
          dict[unit.assetClass].push(unit)

        } else {
          dict[unit.assetClass] = [unit]
        }
      })

      return dict;
  }

}
