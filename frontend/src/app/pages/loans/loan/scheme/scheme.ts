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

// type Duration = {
//     value: number;
//     unit: 'weeks' | 'months';
// };

// type Rent = {
//     amount: number;
//     frequency: 'weekly' | 'monthly';
// };

export interface Lease {
    id?: number;
    unitId?: number;
    tenant: string;
    leaseType?: 'openMarket' | 'discountedMarket';
    // rentTarget: Rent;
    // rentAchieved: Rent;
    rentTargetAmount: number;
    rentTargetFrequency: 'weekly' | 'monthly';
    rentAchievedAmount: number;
    rentAchievedFrequency: 'weekly' | 'monthly';
    startDate: Date,
    endDate?: Date,
    // duration: Duration;
    durationValue: number;
    durationUnit: 'weeks' | 'months';
}

