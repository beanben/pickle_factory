import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Lease, Sale, Scheme } from '../../scheme';
import { AssetClassType, Unit } from '../../scheme.model';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Choice } from 'src/app/shared/shared';

@Component({
  selector: 'app-unit-schedule',
  templateUrl: './unit-schedule.component.html',
  styleUrls: ['./unit-schedule.component.css']
})
export class UnitScheduleComponent implements OnInit, OnChanges {
  openAssetClassModal = false;
  modalMode = "";
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  totalSalePriceTarget = 0;
  totalSalePriceAchieved = 0;
  averageLeaseRentTarget = 0;
  averageLeaseRentAchieved = 0;

  unitsSaleLeaseData: { unit: Unit; sale: Sale; lease: Lease }[] = [];

  // @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  // @Input() availableUseChoices: Choice[] = [];
  unitStructure = {} as Unit;
  assetClassUnits:Unit[] =[];

  constructor(
    private _schemeService: SchemeService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass'] && changes['assetClass'].currentValue) {
      this.unitStructure = new Unit(this.assetClass);
      // this.getAssetClassUnits(this.assetClass);
      
      this.getAssetClassUnitsWithSaleAndLease(this.assetClass);
      console.log("assetClass changed : ", this.assetClass)
    }
  }

  // getAssetClassUnits(assetClass: AssetClassType) {
  //   this._schemeService.getAssetClassUnits(assetClass)
  //     .subscribe((units: Unit[]) => {
  //       this.assetClassUnits = units;
  //       this.calculateTotals(units);
  //     });
  // };

  getAssetClassUnitsWithSaleAndLease(assetClass: AssetClassType) {
    this._schemeService.getAssetClassUnitsWithSaleAndLease(assetClass)
      .subscribe((units: { unit: Unit; sale: Sale; lease: Lease }[]) => {
        this.unitsSaleLeaseData = units;
        this.calculateTotals(units.map(unit => unit.unit));
        this.calculateTotalsSale(units.map(unit => unit.sale));
        this.calculateAveragesLease(units.map(unit => unit.lease));
      });
  };


  calculateTotals(units: Unit[]){
    this.totalUnits = units.length;
    this.totalAreaSize = units.reduce((acc, units) => acc + (Number(units.areaSize) ?? 0), 0)
    this.totalBeds  = units?.reduce((acc, units) => acc + (units.beds ?? 0), 0);
  }

  calculateTotalsSale(sales: Sale[]){
    this.totalSalePriceTarget = sales.reduce((acc, sale) => acc + (Number(sale.priceTarget) ?? 0), 0)
    this.totalSalePriceAchieved = sales.reduce((acc, sale) => acc + (Number(sale.priceAchieved) ?? 0), 0)
  }

  calculateAveragesLease(leases: Lease[]){
    // this.averageLeaseRentTarget = leases.reduce((acc, lease) => acc + (Number(lease.rentTarget) ?? 0), 0) / leases.length;
    // this.averageLeaseRentAchieved = leases.reduce((acc, lease) => acc + (Number(lease.rentAchieved) ?? 0), 0) / leases.length;
  }

}
