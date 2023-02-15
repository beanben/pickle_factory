export interface Scheme {
    id: number;
    name: string;
    streetName?: string;
    postcode?: string;
    city: string;
    country?: string;
    currency: "GBP" | "EUR" | "USD";
    system: "SQFT" | "SQM";
    loanId: number;
    units?: Unit[],
}

// export interface AssetClass {
//     id?: number,
//     schemeId: number,
//     assetClassType: "BTS" | "BTL" | "H" | "C" | "O" | "S" | "PBSA",
//     units?: Unit[],
//     value?: number
// }

// export interface Unit {
//     id?: number,
//     assetClassId?: number,
//     unitType: "unit" | "rooms",
//     description: string,
//     quantity: number,
//     beds: number | null,
//     area: number | null,
//     areaType: "NIA" | "NSA" | "GIA",
//     areaSystem?: "SQFT" | "SQM",  
//     value?: number
// }

// export interface Unit {
//     id?: number,
//     schemeId?: number,
//     assetClass: "BTS" | "BTL" | "H" | "C" | "O" | "S" | "PBSA",
//     unitType: "unit" | "rooms",
//     description: string,
//     quantity: number,
//     beds: number | null,
//     area: number | null,
//     areaType: "NIA" | "NSA" | "GIA",
//     areaSystem?: "SQFT" | "SQM",  
// }

export interface Unit {
    id?: number,
    schemeId?: number,
    assetClass: string,
    unitType: "unit" | "rooms",
    description: string,
    quantity: number,
    beds: number | null,
    area: number | null,
    areaType: "NIA" | "NSA" | "GIA",
    areaSystem?: "SQFT" | "SQM",  
}