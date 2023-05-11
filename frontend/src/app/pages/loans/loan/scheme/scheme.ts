import {  Lease, Sale, Unit } from "./scheme.model";

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
    // assetClasses: AssetClassType[],
}

// export interface Sale {
//     id?: number;
//     unit: Unit;
//     status: 'available' | 'underOffer' | 'exchanged' | 'completed';
//     statusDate: Date;
//     priceTarget: number;
//     priceAchieved: number;
//     buyer: string;
// }

// export interface Lease {
//     id?: number;
//     unit: Unit;
//     tenant: string;
//     leaseType?: 'openMarket' | 'discountedMarket';
//     rentTargetAmount: number;
//     rentTargetFrequency: 'weekly' | 'monthly';
//     rentAchievedAmount: number;
//     rentAchievedFrequency: 'weekly' | 'monthly';
//     startDate: Date,
//     durationValue: number;
//     durationUnit: 'weeks' | 'months';
//     endDate: Date,
// }

// export interface Unit {
//     assetClassId: number,
//     label: "unit" | "room",
//     identifier: string,
//     description: string,
//     beds?: number,
//     areaType: "NIA" | "GIA",
//     areaSize?: number,
//     areaSystem: "sqft" | "sqm",
//     id?: number,
//     sale?: Sale,
//     lease?: Lease,
// }

export type AssetClassType = Hotel | Residential | Commercial | StudentAccommodation | Office | ShoppingCentre;

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

export class AssetClassFactory {
    constructor(private scheme: Scheme) { }

    defineAssetClass(use: string): AssetClassType {
        const baseAssetClass = {
            schemeId: this.scheme.id,
            investmentStrategy: "",
        };

        switch (use) {
            case 'hotel':
                return { ...baseAssetClass, use: 'hotel' };
            case 'residential':
                return { ...baseAssetClass, use: 'residential' };
            case 'commercial':
                return { ...baseAssetClass, use: 'commercial' };
            case 'studentAccommodation':
                return { ...baseAssetClass, use: 'studentAccommodation' };
            case 'office':
                return { ...baseAssetClass, use: 'office' };
            case 'shoppingCentre':
                return { ...baseAssetClass, use: 'shoppingCentre' };
            default:
                return { ...baseAssetClass, use: 'residential' };
        }
    }
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