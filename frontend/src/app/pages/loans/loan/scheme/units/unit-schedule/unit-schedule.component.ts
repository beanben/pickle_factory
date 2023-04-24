import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';

@Component({
  selector: 'app-unit-schedule',
  templateUrl: './unit-schedule.component.html',
  styleUrls: ['./unit-schedule.component.css']
})
export class UnitScheduleComponent implements OnInit, OnChanges {
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  totalSalePriceTarget = 0;
  totalSalePriceAchieved = 0;
  averageLeaseRentTarget = 0;
  averageLeaseRentAchieved = 0;

  @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  unitStructure = {} as Unit;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass']) {
      this.unitStructure = new Unit(this.assetClass);
      this.calculateUnitTotals();
    }
  }

  calculateUnitTotals(){
    this.totalUnits = this.assetClass.units?.length ?? 0;
    
    const totalAreaSizeCalc = this.assetClass.units?.reduce((acc, units) => acc + (+(units.areaSize ?? 0)), 0)
    this.totalAreaSize = +(totalAreaSizeCalc ?? 0).toFixed(2);

    const totalBedsCalc = this.assetClass.units?.reduce((acc, units) => acc + (units.beds ?? 0), 0);
    this.totalBeds = totalBedsCalc ?? 0;
  }

}
