import { Unit } from "./units/unit";

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
    units: Unit[]
}
