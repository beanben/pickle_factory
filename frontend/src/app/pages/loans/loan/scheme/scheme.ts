import { Loan } from "../loan";
import { AssetClassType, Unit } from "./scheme.model";

export interface Scheme {
    id: number;
    loan: Loan;
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

export interface Sale {
    id?: number;
    unit: Unit;
    status: 'available' | 'underOffer' | 'exchanged' | 'completed';
    statusDate: Date;
    priceTarget: number;
    priceAchieved: number;
    buyer: string;
}

export interface Lease {
    id?: number;
    unit: Unit;
    tenant: string;
    leaseType?: 'openMarket' | 'discountedMarket';
    rentTargetAmount: number;
    rentTargetFrequency: 'weekly' | 'monthly';
    rentAchievedAmount: number;
    rentAchievedFrequency: 'weekly' | 'monthly';
    startDate: Date,
    durationValue: number;
    durationUnit: 'weeks' | 'months';
    endDate: Date,
}

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

export interface AssetClassUnits {
    assetClass: AssetClassType;
    units: Unit[];
}