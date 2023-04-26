import { AssetClassType } from "./scheme.model";

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
    assetClasses: AssetClassType[],
}

export interface Sale {
    id?: number;
    unitId?: number;
    status: 'available' | 'underOffer' | 'exchanged' | 'completed';
    statusDate: Date;
    priceTarget: number;
    priceAchieved: number;
    buyer: string;
}

export interface Lease {
    id?: number;
    unitId?: number;
    tenant: string;
    leaseType?: 'openMarket' | 'discountedMarket';
    rentTargetAmount: number;
    rentTargetFrequency: 'weekly' | 'monthly';
    rentAchievedAmount: number;
    rentAchievedFrequency: 'weekly' | 'monthly';
    startDate: Date,
    endDate?: Date,
    durationValue: number;
    durationUnit: 'weeks' | 'months';
}

export interface Unit {
    assetClassId: number,
    label: "unit" | "room",
    identifier: string,
    description: string,
    beds?: number,
    areaType: "NIA" | "GIA",
    areaSize?: number,
    areaSystem: "sqft" | "sqm",
    id?: number,
    sale?: Sale,
    lease?: Lease,
}

