import { Scheme } from "./scheme";


export type AssetClassType = Hotel |
    Residential |
    Commercial |
    StudentAccommodation |
    Office |
    ShoppingCentre

export abstract class AssetClassAbstract {
    abstract readonly use: string;

    constructor(
        public scheme: Scheme,
        public investmentStrategy: string = "",
        public id?: number,
    ) {
    }
}

// export abstract class AssetClassAbstract {
//     // abstract readonly use: string;

//     constructor(
//         public id?: number,
//         public use = "",
//         public scheme = {} as Scheme,
//         public investmentStrategy= "",
        
//     ) {
//     }
// }

export class Hotel extends AssetClassAbstract {
    readonly use = "hotel";
}

export class Residential extends AssetClassAbstract {
    readonly use = "residential";
}

export class Commercial extends AssetClassAbstract {
    readonly use = "commercial";
}

export class StudentAccommodation extends AssetClassAbstract {
    readonly use = "student accommodation";
}

export class Office extends AssetClassAbstract {
    readonly use = "office";
}

export class ShoppingCentre extends AssetClassAbstract {
    readonly use = "shopping centre";
}

export class Unit {
    readonly label: "unit" | "room";
    readonly areaType: "NIA" | "GIA";

    constructor(
        public assetClass: AssetClassType,
        public identifier: string = "",
        public description: string = "",
        public beds?: number,
        public areaSize?: number,
        public areaSystem: "sqft" | "sqm" = "sqft",
        public id?: number,
    ) {
        this.label = this.defineLabel();
        this.areaType = this.defineAreaType();
    }

    defineLabel(): "unit" | "room" {
        const hasRooms = ["hotel", "student accommodation"];
        const hasUnits = ["commercial", "office", "shopping centre", "residential"];
        return hasRooms.includes(this.assetClass.use.toLowerCase()) ? "room" : "unit";
    }

    defineAreaType(): "NIA" | "GIA" {
        const isNIA = ["hotel", "student accommodation", "residential"];
        const isGIA = ["commercial", "office", "shopping centre",];
        return isNIA.includes(this.assetClass.use.toLowerCase()) ? "NIA" : "GIA";
    }

    hasBeds(): boolean {
        const hasBeds = ["student accommodation", "hotel", "residential"];
        return hasBeds.includes(this.assetClass.use.toLowerCase());
    }

}

export class AssetClassFactory {
    constructor(private scheme: Scheme) { }

    defineAssetClass(use: string): AssetClassType {
        switch (use) {
            case 'hotel':
                return new Hotel(this.scheme);
            case 'residential':
                return new Residential(this.scheme);
            case 'commercial':
                return new Commercial(this.scheme);
            case 'student accommodation':
                return new StudentAccommodation(this.scheme);
            case 'office':
                return new Office(this.scheme);
            case 'shopping centre':
                return new ShoppingCentre(this.scheme);
            default:
                return new Residential(this.scheme);
        }
    }
}

export class Sale {
    constructor(
        public unit: Unit,
        public status: 'available' | 'underOffer' | 'exchanged' | 'completed' = "available",
        public statusDate: Date = new Date(),
        public priceTarget: number = 0,
        public priceAchieved: number = 0,
        public buyer: string = "",
        public id?: number,
    ) { }
}

export class Lease {
    readonly rentFrequency: 'perWeek' | 'perMonth';
    readonly leaseFrequency: 'weeks' | 'months';

    constructor(
        public unit: Unit,
        public tenant: string = "",
        public leaseType: 'openMarket' | 'discountedMarket' = "openMarket",
        public rentTarget: number = 0,
        public rentAchieved: number = 0,
        public startDate: Date = new Date(),
        public term: number = 0,
        public endDate: Date = new Date(),
        public id?: number,
    ) { 
        this.rentFrequency = this.defineRentFrequency();
        this.leaseFrequency = this.defineLeaseFrequency();
    }

    defineRentFrequency(): 'perWeek' | 'perMonth' {
        const use: string = this.unit.assetClass.use;
        return use === 'student accommodation' ? 'perWeek' : 'perMonth';
    };

    defineLeaseFrequency(): 'weeks' | 'months' {
        return this.rentFrequency === 'perWeek' ? 'weeks' : 'months';
    }

}