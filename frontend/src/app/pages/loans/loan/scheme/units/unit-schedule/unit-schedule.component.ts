import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Scheme, UnitScheduleData } from '../../scheme';
import { AssetClassType, Lease, Sale, Unit } from '../../scheme.model';
import { SchemeService } from 'src/app/_services/scheme/scheme.service';
import { Choice } from 'src/app/shared/shared';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-unit-schedule',
  templateUrl: './unit-schedule.component.html',
  styleUrls: ['./unit-schedule.component.css']
})
export class UnitScheduleComponent implements OnInit, OnChanges {
  openUnitScheduleModal = false;
  openAssetClassModal = false;
  modalMode = "";
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  totalSalePriceTarget = 0;
  totalSalePriceAchieved = 0;
  averageLeaseRentTarget = 0;
  averageLeaseRentAchieved = 0;

  rentFrequencyLabel = '';
  rentFrequencyChoices: Choice[] = [];
  leaseFrequencyLabel = '';
  leaseFrequencyChoices: Choice[] = [];

  unitsScheduleData: UnitScheduleData[] = [];
  unitStructure = {} as Unit;
  leaseStructure = {} as Lease;

  // @Input() scheme = {} as Scheme;
  @Input() assetClass = {} as AssetClassType;
  // @Input() availableUseChoices: Choice[] = [];
  // unitStructure = {} as Unit;
  assetClassUnits: Unit[] = [];

  constructor(
    private _schemeService: SchemeService
  ) { }

  async ngOnInit() {
    await this.getChoices('rentFrequency', this.rentFrequencyChoices);
    await this.getChoices('leaseFrequency', this.leaseFrequencyChoices);
    this.unitStructure = new Unit(this.assetClass);
    this.defineLeaseParammetres(this.unitStructure);
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['assetClass'] && changes['assetClass'].currentValue) {
      this.unitStructure = new Unit(this.assetClass);

      this.defineLeaseParammetres(this.unitStructure);
      this.getAssetClassUnitsWithSaleAndLease(this.assetClass);
    }
  }

  defineLeaseParammetres(unit: Unit) {
    this.leaseStructure = new Lease(unit);
    // this.rentFrequencyLabel = this.defineRentFrequency(this.rentFrequencyChoices);
    // this.leaseFrequencyLabel = this.defineLeaseFrequency();

    const rentFrequencyChoice = this.rentFrequencyChoices.find(
      (choice: Choice) => choice.value === this.leaseStructure.rentFrequency
    );
    this.rentFrequencyLabel = rentFrequencyChoice ? rentFrequencyChoice.label : '';


    const leaseFrequencyChoice = this.leaseFrequencyChoices.find(
      (choice: Choice) => choice.value === this.leaseStructure.leaseFrequency
    );
    this.leaseFrequencyLabel = leaseFrequencyChoice ? leaseFrequencyChoice.label : '';

  }

  async getChoices(choiceType: string, targetArray: Choice[]): Promise<void> {
    const choices$ = this._schemeService.getChoices(choiceType);
    const choices: Choice[] = await lastValueFrom(choices$);

    targetArray.push(...choices);
  }

  // defineRentFrequency(frequencyChoices: Choice[]): string {
  //   const frequencyChoiceValue: string = this.leaseStructure.rentFrequency
  //   const choice = frequencyChoices.find(
  //     (item: Choice) => item.value === frequencyChoiceValue
  //   );

  //   return choice ? choice.label : '';
  // };

  // defineLeaseFrequency(): string {
  //   const frequencyChoiceValue: string = this.leaseStructure.leaseFrequency
  //   const choice = this.leaseFrequencyChoices.find(
  //     (item: Choice) => item.value === frequencyChoiceValue
  //   );
  //   return choice ? choice.label : '';
  // }

  // getAssetClassUnits(assetClass: AssetClassType) {
  //   this._schemeService.getAssetClassUnits(assetClass)
  //     .subscribe((units: Unit[]) => {
  //       this.assetClassUnits = units;
  //       this.calculateTotals(units);
  //     });
  // };

  getAssetClassUnitsWithSaleAndLease(assetClass: AssetClassType) {
    this._schemeService.getAssetClassUnitsWithSaleAndLease(assetClass)
      .subscribe((unitsScheduleData: UnitScheduleData[]) => {

        this.unitsScheduleData = unitsScheduleData.map(unitData => this.buildUnitScheduleData(unitData));

        this.calculateTotals(unitsScheduleData.map(unitScheduleData => unitScheduleData.unit));
        this.calculateTotalsSale(unitsScheduleData.map(unitScheduleData => unitScheduleData.sale));
        this.calculateAveragesLease(unitsScheduleData.map(unitScheduleData => unitScheduleData.lease));
      });
  };

  buildUnitScheduleData(unitScheduleData: UnitScheduleData): UnitScheduleData {
    const unit = this.buildUnit(unitScheduleData.unit);
    const sale = this.buildSale(unit, unitScheduleData.sale);
    const lease = this.buildLease(unit, unitScheduleData.lease);

    return { unit, sale, lease };
  }

  buildUnit(unitData: Unit): Unit {
    return new Unit(
      this.assetClass,
      unitData.identifier,
      unitData.description,
      unitData.beds,
      unitData.areaSize,
      unitData.areaSystem,
      unitData.id
    );
  }

  buildSale(unit: Unit, saleData: Sale): Sale {
    return new Sale(
      unit,
      saleData.status,
      saleData.statusDate,
      saleData.priceTarget,
      saleData.priceAchieved,
      saleData.buyer,
      saleData.id
    );
  }

  buildLease(unit: Unit, leaseData: Lease): Lease {
    return new Lease(
      unit,
      leaseData.tenant,
      leaseData.leaseType,
      leaseData.rentTarget,
      leaseData.rentAchieved,
      leaseData.startDate,
      leaseData.term,
      leaseData.endDate,
      leaseData.id
    );
  }


  calculateTotals(units: Unit[]) {
    this.totalUnits = units.length;
    this.totalAreaSize = units.reduce((acc, units) => acc + (Number(units.areaSize) ?? 0), 0)
    this.totalBeds = units?.reduce((acc, units) => acc + (units.beds ?? 0), 0);
  }

  calculateTotalsSale(sales: Sale[]) {
    this.totalSalePriceTarget = sales.reduce((acc, sale) => acc + (Number(sale.priceTarget) ?? 0), 0)
    this.totalSalePriceAchieved = sales.reduce((acc, sale) => acc + (Number(sale.priceAchieved) ?? 0), 0)
  }

  calculateAveragesLease(leases: Lease[]) {
    // this.averageLeaseRentTarget = leases.reduce((acc, lease) => acc + (Number(lease.rentTarget) ?? 0), 0) / leases.length;
    // this.averageLeaseRentAchieved = leases.reduce((acc, lease) => acc + (Number(lease.rentAchieved) ?? 0), 0) / leases.length;
  }

  onOpenUnitScheduleModal(modalMode: string) {
    this.openUnitScheduleModal = true;
    this.modalMode = modalMode;
  }

  onCloseUnitScheduleModal(unitsScheduleData: UnitScheduleData[] | null) {
    this.openUnitScheduleModal = false;

    if (unitsScheduleData) {
      this.unitsScheduleData = unitsScheduleData;
    }
  }

}
