import { Component, Input, OnInit } from '@angular/core';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';

@Component({
  selector: 'app-sales-schedule',
  templateUrl: './sales-schedule.component.html',
  styleUrls: ['./sales-schedule.component.css']
})
export class SalesScheduleComponent implements OnInit {
  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit;
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;


  constructor() { }

  ngOnInit(): void {
    this.unitStructure = new Unit(this.assetClass);
    this.calculateUnitTotals();
  }

  calculateUnitTotals(){
    this.totalUnits = this.assetClass.units?.length ?? 0;
    
    const totalAreaSizeCalc = this.assetClass.units?.reduce((acc, units) => acc + (+(units.areaSize ?? 0)), 0)
    this.totalAreaSize = +(totalAreaSizeCalc ?? 0).toFixed(2);

    const totalBedsCalc = this.assetClass.units?.reduce((acc, units) => acc + (units.beds ?? 0), 0);
    this.totalBeds = totalBedsCalc ?? 0;
  }

}
