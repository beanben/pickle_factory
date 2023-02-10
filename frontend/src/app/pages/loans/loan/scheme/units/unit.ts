
export interface Unit {
    id?: number,
    assetClass: "BTS" | "BTL" | "H" | "C" | "O" | "S" | "PBSA",
    type: "unit" | "rooms",
    description: string,
    quantity: number,
    beds: number | null,
    area: number | null,
    areaType: "NIA" | "NSA" | "GIA",
    areaSystem?: "SQFT" | "SQM",
    schemeId: number
}


