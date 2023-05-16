import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SchemeService} from 'src/app/_services/scheme/scheme.service';
import {Subscription} from 'rxjs';
import {AssetClassType} from 'src/app/_types/custom.type';
import {AssetClassUnits, Scheme, Unit, UnitStructure} from 'src/app/_interfaces/scheme.interface';
import {UnitService} from 'src/app/_services/unit/unit.service';
import { Choice } from 'src/app/_interfaces/shared.interface';

interface UnitGroup {
  description: string;
  quantity: number;
  beds: number;
  areaSize: number;
}

@Component({
  selector: 'app-unit-card',
  templateUrl: './unit-card.component.html'
})
export class UnitCardComponent implements OnInit, OnChanges {
  @Input() assetClass = {} as AssetClassType;
  @Input() scheme = {} as Scheme;
  @Input() assetClassUnits = {} as AssetClassUnits;
  @Input() useChoices: Choice[] = [];
  // assetClass = {} as AssetClassType;
  // @Input() assetClassUnits = {} as AssetClassUnits;
  unitStructure = {} as UnitStructure;
  unitsGrouped: UnitGroup[] = [];
  totalQuantity = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  subs: Subscription[] = [];

  constructor(private _schemeService: SchemeService, private _unitService: UnitService) {}

  ngOnInit(): void {
    this.defineUnitStructure()
    this.defineUnitGroups();

    // this.assetClass = this.assetClassUnits.assetClass;
    // this.unitStructure = new Unit(this.assetClass);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClassUnits'] && changes['assetClassUnits'].currentValue) {
      this.defineUnitStructure();
      this.defineUnitGroups();
      // const assetClass: AssetClassType = changes['assetClassUnits'].currentValue;
      // this.getAssetClassUnits(assetClass);
    }
  }

  defineUnitStructure() {
    const assetClass: AssetClassType = this.assetClassUnits.assetClass;
    this.unitStructure = this._unitService.createUnitStructure(assetClass, this.scheme);
  }

  defineUnitGroups() {
    const units: Unit[] = this.assetClassUnits.units;
    this.unitsGrouped = this.groupByDescription(units);
    this.calculateTotals(this.unitsGrouped);
  }

  // getAssetClassUnits(assetClass: AssetClassType) {
  //   this._schemeService.getAssetClassUnits(assetClass).subscribe((units: Unit[]) => {
  //     this.unitsGrouped = this.groupByDescription(units);
  //     this.calculateTotals(this.unitsGrouped);
  //   });
  // }

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
        areaSize: 0
      };
      unitsGrouped.push(unitGroup);
    }

    return unitGroup;
  }

  calculateTotals(unitsGrouped: UnitGroup[]) {
    this.totalQuantity = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.quantity, 0);
    this.totalAreaSize = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.areaSize, 0);
    this.totalBeds = unitsGrouped.reduce((total, unitGroup) => total + unitGroup.beds, 0);
  }

  getUseLabel(use: string): string {
    const useChoice = this.useChoices.find(choice => choice.value === use);
    return useChoice ? useChoice.label : '';
  }
}
