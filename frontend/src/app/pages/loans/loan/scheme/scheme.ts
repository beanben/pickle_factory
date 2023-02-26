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
    assetClasses?: AssetClass[],
}

export interface AssetClass {
    id: number;
    schemeId: number;
    units: Unit[]
}
export interface Hotel extends AssetClass {
}
export interface Residential extends AssetClass {
}
export interface Retail extends AssetClass {
    description: string,
}
export interface StudentAccommodation extends AssetClass {
}
export interface Office extends AssetClass {
}
export interface ShoppingCentre extends AssetClass {
}

export interface Unit {
    id?: number,
    assetClassId?: number,
    label: "unit" | "room",
    identifier: string,
    description: string,
    areas?: Area[],
    beds?: Bed[],
}

export interface Area {
    id?: number,
    unitId?: number,
    size: number,
    type: string,
    system : "SQFT" | "SQM"
}

export interface Bed {
    id?: number,
    unitId?: number,
    description?: string,
    width?: number, 
    length?: number, 
    height?: number,
    measure?: "CM" | "IN",
}
