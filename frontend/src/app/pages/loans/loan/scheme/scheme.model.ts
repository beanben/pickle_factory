import { Scheme } from "./scheme";


export type AssetClassType = Hotel |
    Residential |
    Commercial |
    StudentAccommodation |
    Office |
    ShoppingCentre

// export abstract class AssetClassAbstract {
//     abstract readonly use: string;
//     readonly areaSystem: "sqft" | "sqm";

//     constructor(
//         public units: Unit[] = [],
//         public id?: number,
//         public schemeId?: number,
//         public investmentStrategy?: string
//     ) { 
//         this.areaSystem = this.getAreaSystem();
//     }

//     getAreaSystem(): "sqft" | "sqm" {
//        return this._schemeService.getScheme(this.schemeId).areaSystem; 
//     }
// }

export abstract class AssetClassAbstract {
    abstract readonly use: string;
    readonly areaSystem: "sqft" | "sqm";

    constructor(
        public units: Unit[] = [],
        public scheme: Scheme,
        public id?: number,
        public investmentStrategy?: string
    ) { 
        this.areaSystem = this.getAreaSystem();
    }

    getAreaSystem(): "sqft" | "sqm" {
        return this.scheme.system.toLowerCase() as "sqft" | "sqm";
    }
}

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
        public id?: number,
        public identifier?: string,
        public description: string = "",
        public areaSize?: number,
        public areaSystem?: "sqft" | "sqm",
        public beds?: number,
        public value?: number,
        public salesStatus?: string,
        public salesStatusDate?: Date,
        public salesPrice?: number,
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
