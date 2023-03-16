import { UnitGroup } from "./scheme";


export type AssetClassType = Hotel | 
                            Residential | 
                            Retail | 
                            StudentAccommodation | 
                            Office | 
                            ShoppingCentre

export abstract class AssetClassAbstract {
    abstract readonly use: string;
    public unitsGrouped: UnitGroup[] = [];

    constructor(
        public schemeId?: number, 
        public units?: Unit[], 
        public id?: number
    ) {}
    
}

export class Hotel extends AssetClassAbstract {
    readonly use = "hotel";

    constructor(
        schemeId?: number,
        units?: Unit[],
        id?: number
    ) {
        super(schemeId, units, id);
    }
}

export class Residential extends AssetClassAbstract {
     readonly use = "residential";

    constructor(
        schemeId?: number,
        units?: Unit[],
        id?: number
    ) {
        super(schemeId, units, id);
    }
}

export class Retail extends AssetClassAbstract {
     readonly use = "retail";

    constructor(
        schemeId?: number,
        units?: Unit[],
        id?: number,
        public description?: string
    ) {
        super(schemeId, units, id);
    }
}

export class StudentAccommodation extends AssetClassAbstract {
     readonly use = "student accommodation";

    constructor(
        schemeId?: number,
        units?: Unit[],
        id?: number
    ) {
        super(schemeId, units, id);
    }
}

export class Office extends AssetClassAbstract {
     readonly use = "office";

    constructor(
        schemeId?: number,
        units?: Unit[],
        id?: number
    ) {
        super(schemeId, units, id);
    }
}

export class ShoppingCentre extends AssetClassAbstract {
     readonly use = "shopping centre";

    constructor(
        schemeId?: number,
        units?: Unit[],
        id?: number
    ) {
        super(schemeId, units, id);
    }
}

export class Unit {
     label: "unit" | "room" = "unit";
     areaType: "NIA" | "GIA" = "NIA";

    constructor(
        public assetClass: AssetClassType,
        public id?: number,
        public identifier?: string,
        public description: string = "",
        public areaSize?: number,
        public beds?: number,
        // public quantity?: number,
    ) {
        this.label = this.defineLabel();
        this.areaType = this.defineAreaType();
    }

    defineLabel(): "unit" | "room" {
        const hasRooms = ["hotel", "student accommodation"];
        const hasUnits = ["retail", "office", "shopping centre", "residential"];
        return hasRooms.includes(this.assetClass.use.toLowerCase()) ? "room" : "unit";
    }

    defineAreaType(): "NIA" | "GIA"{
        const isNIA = ["hotel", "student accommodation", "residential"];
        const isGIA = ["retail", "office", "shopping Centre", ];
        return isNIA.includes(this.assetClass.use.toLowerCase()) ? "NIA" : "GIA";
    }

    hasBeds(): boolean {
        const hasBeds = ["student accommodation", "hotel", "residential"];
        return hasBeds.includes(this.assetClass.use.toLowerCase());
    }
    
}
