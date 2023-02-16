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

export interface Unit {
    id?: number,
    schemeId?: number,
    assetClass: string,
    unitType: "unit" | "room",
    description: string,
    quantity: number,
    beds: number | null,
    area: number | null,
    areaType: "NIA" | "NSA" | "GIA",
    areaSystem?: "SQFT" | "SQM",  
}

// export interface Unit {
//     id?: number,
//     schemeId?: number,
//     description: string,
//     quantity: number,
//     area: number | null
// }

// export interface ResidentialUnit extends Unit {
//     assetClass: "BTS" | "BTL",
//     unitType: "unit",
//     beds: number | null,
//     areaType: "NIA"
// }

// export interface HotelRoom extends Unit {
//     assetClass: "H",
//     unitType: "room",
//     beds: number | null,
//     areaType: "NIA"
// }

// export interface CommercialUnit extends Unit {
//     assetClass: "C",
//     unitType: "unit",
//     areaType: "GIA"
// }

// export interface OfficeUnit extends Unit {
//     assetClass: "O",
//     unitType: "unit",
//     areaType: "GIA"
// }

// export interface ShoppingCenterUnit extends Unit {
//     assetClass: "S",
//     unitType: "unit",
//     areaType: "GIA"
// }

// export interface StudentRoom extends Unit {
//     assetClass: "PBSA",
//     unitType: "room",
//     beds: number | null,
//     areaType: "NIA"
// }
