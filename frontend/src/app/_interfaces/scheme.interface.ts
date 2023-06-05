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
  // subUse: string;
  schemeId: number;
  investmentStrategy: string;
  hasBeds?: boolean;
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

export interface Parking extends AssetClass {
  use: 'parking';
}


export interface AssetClassData {
  assetClass: AssetClassType;
  units: Unit[];
}


export interface UnitScheduleData {
  unit: Unit;
  sale?: Sale;
  lease?: Lease;
}

export interface Unit {
  id?: number;
  assetClassId?: number;
  identifier?: string;
  description: string;
  beds?: number;
  areaSize: number;
  areaType?: 'NIA' | 'GIA';
  areaSystem?: 'sqft' | 'sqm';
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
  rentFrequency?: 'perDay' | 'perWeek' | 'perMonth';
  startDate?: Date;
  endDate?: Date;
  leaseType: string;
}

export interface LeaseStructure {
  rentFrequency: 'perDay' | 'perWeek' | 'perMonth';
  rentFrequencyDisplay?: string;
}

export interface Sale {
  id?: number;
  unitId?: number;
  ownershipType: string;
  priceTarget?: number;
  priceAchieved?: number;
  status: string;
  statusDate?: Date;
  buyer?: string;
  
}

export interface FieldOption {
  name: string;
  options: string[];
}
