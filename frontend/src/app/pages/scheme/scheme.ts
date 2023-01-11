import { Loan } from "../loan/loan";

export interface Scheme {
    id: string;
    name: string;
    street_name?: string;
    postcode?: string;
    city: string;
    country?: string;
    loan_id?: string;
}
