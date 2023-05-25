import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import {SchemeService} from 'src/app/_services/scheme/scheme.service';

import {lastValueFrom} from 'rxjs';
import {Choice} from 'src/app/_interfaces/shared.interface';
import {
  Lease,
  LeaseStructure,
  Sale,
  Scheme,
  Unit,
  UnitScheduleData,
  UnitStructure
} from 'src/app/_interfaces/scheme.interface';
import {AssetClassType} from 'src/app/_types/custom.type';
import {UnitService} from 'src/app/_services/unit/unit.service';
import {SharedService} from 'src/app/_services/shared/shared.service';

@Component({
  selector: 'app-unit-schedule',
  templateUrl: './unit-schedule.component.html',
  styleUrls: ['./unit-schedule.component.css']
})
export class UnitScheduleComponent implements OnInit, OnChanges {
  openUnitScheduleModal = false;
  openUploadModal = true;
  openAssetClassModal = false;
  modalMode = '';
  totalUnits = 0;
  totalAreaSize = 0;
  totalBeds = 0;
  totalSalePriceTarget = 0.0;
  totalSalePriceAchieved = 0.0;
  averageLeaseRentTarget = 0.0;
  averageLeaseRentAchieved = 0.0;

  rentFrequencyLabel = '';
  rentFrequencyChoices: Choice[] = [];
  saleStatusChoices: Choice[] = [];
  leaseTypeChoices: Choice[] = [];

  unitsScheduleData: UnitScheduleData[] = [];
  unitStructure = {} as UnitStructure;
  leaseStructure = {} as LeaseStructure;

  @Input() assetClass = {} as AssetClassType;
  @Input() scheme = {} as Scheme;
  assetClassUnits: Unit[] = [];

  constructor(
    private _schemeService: SchemeService,
    private _unitService: UnitService,
    private _sharedService: SharedService
  ) {}

  async ngOnInit() {
    this.saleStatusChoices = await this.getChoices('saleStatus');
    this.leaseTypeChoices = await this.getChoices('leaseType');
    await this.setUpUnitSchedule(this.assetClass);
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['assetClass'] && changes['assetClass'].currentValue) {
      await this.setUpUnitSchedule(this.assetClass);
    }
  }

  async setUpUnitSchedule(assetClass: AssetClassType) {
    if (assetClass.investmentStrategy === 'buildToSell') {
      await this.getUnitsAndSales(assetClass);
    }

    if (assetClass.investmentStrategy === 'buildToRent') {
      this.rentFrequencyChoices = await this.getChoices('rentFrequency');
      await this.getUnitsAndLeases(assetClass);
      this.leaseStructure = this._unitService.createLeaseStructure(this.assetClass);
    }

    this.unitStructure = this._unitService.createUnitStructure(this.assetClass, this.scheme);
  }

  async getChoices(choiceType: string): Promise<Choice[]> {
    const choices$ = this._sharedService.getChoices(choiceType);
    return await lastValueFrom(choices$);
  }

  async getUnitsAndSales(assetClass: AssetClassType) {
    const unitsScheduleData$ = this._unitService.getUnitsScheduleBTS(assetClass);
    const unitsScheduleData: UnitScheduleData[] = await lastValueFrom(unitsScheduleData$);

    this.unitsScheduleData = unitsScheduleData.map(unitData => this.buildUnitScheduleData(unitData, this.assetClass));

    this.calculateTotals(unitsScheduleData.map(unitScheduleData => unitScheduleData.unit));
    this.calculateTotalsSale(
      unitsScheduleData
        .map(unitScheduleData => unitScheduleData.sale)
        .filter((sale): sale is Sale => sale !== undefined && sale !== null)
    );
  }

  async getUnitsAndLeases(assetClass: AssetClassType) {
    const unitsScheduleData$ = this._unitService.getUnitsScheduleBTR(assetClass);
    const unitsScheduleData: UnitScheduleData[] = await lastValueFrom(unitsScheduleData$);

    this.unitsScheduleData = unitsScheduleData.map(unitData => this.buildUnitScheduleData(unitData, this.assetClass));

    this.calculateTotals(unitsScheduleData.map(unitScheduleData => unitScheduleData.unit));

    this.calculateAveragesLease(
      unitsScheduleData
        .map(unitScheduleData => unitScheduleData.lease)
        .filter((lease): lease is Lease => lease !== undefined && lease !== null)
    );
  }

  buildUnitScheduleData(unitScheduleData: UnitScheduleData, assetClass: AssetClassType): UnitScheduleData {
    const unit = this.buildUnit(unitScheduleData.unit);

    if (assetClass.investmentStrategy === 'buildToSell') {
      const sale = this.buildSale(unitScheduleData.sale);
      return {unit, sale};
    } else {
      const lease = this.buildLease(unitScheduleData.lease);
      return {unit, lease};
    }
  }

  buildUnit(unitData: Unit): Unit {
    return {
      id: unitData.id,
      assetClassId: unitData.assetClassId,
      label: unitData.label,
      identifier: unitData.identifier,
      description: unitData.description,
      beds: unitData.beds,
      areaSize: unitData.areaSize,
      areaType: unitData.areaType,
      areaSystem: unitData.areaSystem
    };
  }

  buildSale(saleData?: Sale): Sale {
    return {
      id: saleData?.id,
      unitId: saleData?.unitId,
      status: saleData?.status || this.saleStatusChoices[0].value,
      statusDate: saleData?.statusDate,
      priceTarget: saleData?.priceTarget,
      priceAchieved: saleData?.priceAchieved,
      buyer: saleData?.buyer,
      ownershipType: saleData?.ownershipType || ''
    };
  }

  buildLease(leaseData?: Lease): Lease {
    return {
      id: leaseData?.id,
      unitId: leaseData?.unitId,
      tenant: leaseData?.tenant,
      rentTarget: leaseData?.rentTarget,
      rentAchieved: leaseData?.rentAchieved,
      rentFrequency: leaseData?.rentFrequency,
      startDate: leaseData?.startDate,
      endDate: leaseData?.endDate,
      leaseType: leaseData?.leaseType || ''
    };
  }

  calculateTotals(units: Unit[]) {
    this.totalUnits = units.length;
    this.totalAreaSize = units.reduce((acc, units) => acc + (Number(units.areaSize) ?? 0), 0);
    this.totalBeds = units?.reduce((acc, units) => acc + (units.beds ?? 0), 0);
  }

  calculateTotalsSale(sales?: Sale[]) {
    this.totalSalePriceTarget = sales?.reduce((acc, sale) => acc + (Number(sale.priceTarget) ?? 0), 0) || 0.0;
    this.totalSalePriceAchieved = sales?.reduce((acc, sale) => acc + (Number(sale.priceAchieved) ?? 0), 0) || 0.0;
  }

  calculateAveragesLease(leases?: Lease[]) {
    const totalRentTarget = leases?.reduce((acc, lease) => acc + (Number(lease.rentTarget) ?? 0), 0) || 0.0;
    this.averageLeaseRentTarget = this.totalUnits !== 0 ? totalRentTarget / this.totalUnits : 0;

    const totalRentAchieved = leases?.reduce((acc, lease) => acc + (Number(lease.rentAchieved) ?? 0), 0) || 0.0;
    this.averageLeaseRentAchieved = this.totalUnits !== 0 ? totalRentAchieved / this.totalUnits : 0;
  }

  onOpenUnitScheduleModal(modalMode: string) {
    this.openUnitScheduleModal = true;
    this.modalMode = modalMode;
  }

  onCloseUnitScheduleModal(unitsScheduleData: UnitScheduleData[] | null) {
    this.openUnitScheduleModal = false;

    if (unitsScheduleData) {
      this.unitsScheduleData = unitsScheduleData;
      this.calculateTotals(unitsScheduleData.map(unitScheduleData => unitScheduleData.unit));

      const sales: (Sale | undefined)[] = unitsScheduleData.map(unitScheduleData => unitScheduleData.sale);
      this.calculateTotalsSale(sales.filter((sale): sale is Sale => sale !== undefined && sale !== null));

      const leases: (Lease | undefined)[] = unitsScheduleData.map(unitScheduleData => unitScheduleData.lease);
      this.calculateAveragesLease(leases.filter((lease): lease is Lease => lease !== undefined && lease !== null));
    }
  }

  // getRentFrequencyLabel(rentFrequencyValue: string): string {
  //   const rentFrequencyChoice = this.rentFrequencyChoices.find(choice => choice.value === rentFrequencyValue);
  //   return rentFrequencyChoice ? rentFrequencyChoice.label : 'not defined';
  // }

  // getLeaseTypeLabel(leaseTypeValue: string): string {
  //   const leaseTypeChoice = this.leaseTypeChoices.find(choice => choice.value === leaseTypeValue);
  //   return leaseTypeChoice ? leaseTypeChoice.label : 'not defined';
  // }

  getChoiceLabel(choice_value: string, choices: Choice[]): string {
    return this._sharedService.getChoiceLabel(choice_value, choices);
  }

  onOpenUploadModal(){
    this.openUploadModal = true;
  }
}
