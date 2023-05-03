import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AssetClassType, Unit } from '../../scheme.model';
import { AssetClassUnits, Scheme } from '../../scheme';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Subscription } from 'rxjs';

interface UnitGroup {
  description: string,
  quantity: number,
  beds: number,
  areaSize: number,
}

@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html'
})
export class UnitCardComponent implements OnInit, OnChanges {
  @Input() assetClass = {} as AssetClassType;
  // assetClass = {} as AssetClassType;
  // @Input() assetClassUnits = {} as AssetClassUnits;
  unitStructure = {} as Unit;
  unitsGrouped: UnitGroup[] = [];
  totalQuantity = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  subs: Subscription[] = [];

  constructor(
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
    // this.assetClass = this.assetClassUnits.assetClass;
    // this.unitStructure = new Unit(this.assetClass);
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass'] && changes['assetClass'].currentValue) {
      const assetClass: AssetClassType = changes['assetClass'].currentValue;
      this.unitStructure = new Unit(this.assetClass);
      this.getAssetClassUnits(assetClass);
    }
  }

  getAssetClassUnits(assetClass: AssetClassType) {
    this._schemeService.getAssetClassUnits(assetClass)
      .subscribe((units: Unit[]) => {

        this.unitsGrouped = this.groupByDescription(units);
        this.calculateTotals(this.unitsGrouped);
      });
  };

  groupByDescription(units: Unit[]): UnitGroup[] {
    return units.reduce((unitsGrouped: UnitGroup[], unit: Unit) => {
      const unitGroup = this.findOrCreateUnitGroup(unitsGrouped, unit);
      unitGroup.quantity += 1;
      unitGroup.beds += unit.beds ?? 0;
      unitGroup.areaSize += Number(unit.areaSize) ?? 0;

      return unitsGrouped;
    }, []);
  }

  findOrCreateUnitGroup(unitsGrouped: UnitGroup[], unit: Unit): UnitGroup {
    let unitGroup = unitsGrouped.find(unitGroup => unitGroup.description === unit.description);

    if (!unitGroup) {
      unitGroup = {
        description: unit.description,
        quantity: 0,
        beds: 0,
        areaSize: 0,
      };
      unitsGrouped.push(unitGroup);
    };

    return unitGroup
  }

  calculateTotals(unitsGrouped: UnitGroup[]) {
    this.totalQuantity = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.quantity, 0);
    this.totalAreaSize = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.areaSize, 0);
    this.totalBeds = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.beds, 0);
  }

}
