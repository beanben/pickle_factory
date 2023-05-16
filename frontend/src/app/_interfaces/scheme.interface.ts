import {AssetClassType} from '../_types/custom.type';

export interface Scheme {
  id: number;
  loanId: number;
  name: string;
  streetName?: string;
  postcode?: string;
  city: string;
  country?: string;
  openingDate?: Date;
  system: 'SQFT' | 'SQM';
  isBuilt: boolean;
}

export interface AssetClass {
  id?: number;
  use: string;
  schemeId: number;
  investmentStrategy: string;
}

export interface Hotel extends AssetClass {
  use: 'hotel';
}

export interface Residential extends AssetClass {
  use: 'residential';
}

export interface Commercial extends AssetClass {
  use: 'commercial';
}

export interface StudentAccommodation extends AssetClass {
  use: 'studentAccommodation';
}

export interface Office extends AssetClass {
  use: 'office';
}

export interface ShoppingCentre extends AssetClass {
  use: 'shoppingCentre';
}

export interface AssetClassUnits {
  assetClass: AssetClassType;
  units: Unit[];
}

// export interface SchemeData {
//   assetClassUnits: AssetClassUnit[];
// }

export interface UnitScheduleData {
  unit: Unit;
  sale?: Sale;
  lease?: Lease;
}

// export interface UnitScheduleBTS {
//   unit: Unit;
//   sale: Sale;
// }

// export interface UnitScheduleBTR {
//   unit: Unit;
//   lease: Lease;
// }

export interface Unit {
  id?: number;
  assetClassId?: number;
  label: 'room' | 'unit';
  identifier?: string;
  description: string;
  beds?: number;
  areaSize: number;
  areaType: 'NIA' | 'GIA';
  areaSystem: 'sqft' | 'sqm';
}

export interface UnitStructure {
  label: 'room' | 'unit';
  areaType: 'NIA' | 'GIA';
  areaSystem: 'sqft' | 'sqm';
  hasBeds: boolean;
}

export interface Lease {
  id?: number;
  unitId?: number;
  tenant?: string;
  rentTarget?: number;
  rentAchieved?: number;
  rentFrequency?: 'perWeek' | 'perMonth';
  startDate?: Date;
  endDate?: Date;
}

export interface LeaseStructure {
  rentFrequency: 'perWeek' | 'perMonth';
}

export interface Sale {
  id?: number;
  unitId?: number;
  status: string;
  statusDate?: Date;
  priceTarget?: number;
  priceAchieved?: number;
  buyer?: string;
}
