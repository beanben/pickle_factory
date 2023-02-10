import { Unit } from "./units/unit";

export interface Scheme {
    id: number;
    name: string;
    street_name?: string;
    postcode?: string;
    city: string;
    country?: string;
    currency: "GBP" | "EUR" | "USD";
    system: "SQFT" | "SQM";
    loan_id: number;
    units: Unit[]
}
