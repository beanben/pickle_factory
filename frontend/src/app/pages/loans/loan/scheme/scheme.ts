export interface Scheme {
    id: number;
    loanId: number;
    name: string;
    streetName?: string;
    postcode?: string;
    city: string;
    country?: string;
    openingDate?: Date;
    assetClasses?: AssetClass[],
}

interface AssetClass {
    id: number;
    schemeId: number; 
}

interface Hotel extends AssetClass {
    rooms?: Unit[],
}

interface Residential extends AssetClass {
    units?: Unit[],
}

interface Retail extends AssetClass {
    units?: Unit[],
}

interface StudentAccommodation extends AssetClass {
    description: string,
    units?: Unit[],
}

export interface Unit {
    id?: number,
    assetClassId?: number,
    identifier: string,
    description: string,
    areas?: Area[],
    beds?: Bed[],
}

export interface Area {
    id?: number,
    assetClassId?: number,
    size: number,
    type: "NIA" | "NSA" | "GIA",
    system : "SQFT" | "SQM"
}

export interface Bed {
    id?: number,
    unitId?: number,
    description: string,
    width: number, 
    length: number, 
    height: number,
    measure: "CM" | "IN",
}
