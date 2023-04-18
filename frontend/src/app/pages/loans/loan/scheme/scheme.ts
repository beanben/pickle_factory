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
    value: number;
    status: 'available' | 'underOffer' | 'exchanged' | 'completed';
    price: number;
    statusDate: Date;
    // buyer: Buyer;
    buyer: string;
}

type Duration = {
    duration: number;
    durationUnit: 'weeks' | 'months';
};

type Rent = {
    amount: number;
    frequency: 'weekly' | 'monthly';
};

export interface Lease {
    id?: number;
    unitId?: number;
    // tenant: Tenant;
    tenant: string;
    leaseType: 'openMarket' | 'discountedMarket';
    rent: Rent;
    startDate: Date,
    endDate: Date,
    duration: Duration;
}

// export interface Tenant {
//     id?: number,
//     unitId?: number,
//     type: 'individual' | 'corporate',
//     individual?: Individual,
//     corporate?: Corporate,
// }

// export interface Buyer {
//     id?: number,
//     unitId?: number,
//     type: 'individual' | 'corporate',
//     individual?: Individual,
//     corporate?: Corporate,
// }

// export interface Individual {
//     id?: number,
//     firstName: string,
//     lastName: string,
// }

// export interface Corporate {
//     id?: number,
//     name: string,
// }

