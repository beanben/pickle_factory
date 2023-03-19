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


export interface Area {
    id?: number,
    unitId?: number,
    size: number,
    type: string,
    system : "SQFT" | "SQM"
}


export interface UnitGroup{
    ids?: number[],
    description: string,
    quantity: number,
    groupBeds?: number,
    bedsPerUnit: number,
    groupAreaSize: number,
}

