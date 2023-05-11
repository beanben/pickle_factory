import { AssetClassType } from "../_types/custom.type";

export interface Scheme {
    id: number;
    loanId: number;
    name: string;
    streetName?: string;
    postcode?: string;
    city: string;
    country?: string;
    openingDate?: Date;
    system: "SQFT" | "SQM";
    isBuilt: boolean;
}

export interface AssetClass {
  use: string;
  schemeId: number;
  investmentStrategy: string;
  id?: number;
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

export interface AssetClassUnit {
    assetClass: AssetClassType;
    units: Unit[];
}

export interface SchemeData {
    assetClassUnits: AssetClassUnit[];
}

export interface UnitScheduleData {
    unit: Unit;
    sale: Sale;
    lease: Lease;
}

export interface Unit {
    id: number;
    assetClassId: number;
    label: "room" | "unit";
    identifier: string;
    description: string;
    beds?: number;
    areaSize: number ;
    area_type: "NIA" | "GIA";
    area_system: "sqft" | "sqm";
  }
  
  
  export interface Lease {
    id: number;
    unitId: number;
    tenant: string;
    leaseType: "openMarket" | "discountedMarket";
    rentTarget: number;
    rentAchieved: number;
    rentFrequency: "perWeek" | "perMonth";
    startDate: Date;
    endDate: Date;
  }
  
  export interface Sale {
    id: number;
    unitId: number;
    status: "available" | "underOffer" | "exchanged" | "completed";
    statusDate: Date;
    priceTarget: number;
    priceAchieved: number;
    buyer: string;
  }

