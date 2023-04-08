import { Component, Input, OnInit } from '@angular/core';
import { AssetClassType, Unit } from '../../scheme.model';
import { Scheme } from '../../scheme';

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
export class UnitCardComponent implements OnInit {
  @Input() assetClass = {} as AssetClassType;
  @Input() scheme = {} as Scheme;
  unitStructure = {} as Unit;
  unitsGrouped: UnitGroup[] = [];
  totalQuantity = 0;
  totalAreaSize = 0;
  totalBeds = 0;

  constructor() { }

  ngOnInit(): void {
    this.unitStructure = new Unit(this.assetClass);
    this.unitsGrouped = this.groupByDescription(this.assetClass.units);
  }

  groupByDescription(units: Unit[]): UnitGroup[] {
    let unitsGrouped: UnitGroup[] = [];

    units.forEach(unit => {
      const descriptionExists = unitsGrouped.some(unitGroup => unitGroup.description === unit.description);

      if (!descriptionExists) {
        const unitGroup = {} as UnitGroup;
        unitGroup.description = unit.description;
        unitGroup.quantity = 0;
        unitGroup.beds = 0;
        unitGroup.areaSize = 0;
        unitsGrouped.push(unitGroup);
      };

      const unitGroup = unitsGrouped.find(unitGroup => unitGroup.description === unit.description);
      unitGroup!.quantity += 1;
      unitGroup!.beds += unit.beds || 0;
      unitGroup!.areaSize += +(unit.areaSize || 0);
    })

    this.totalQuantity = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.quantity, 0);
    this.totalAreaSize = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.areaSize, 0);
    this.totalBeds = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.beds, 0);

    return unitsGrouped;
  }

}
