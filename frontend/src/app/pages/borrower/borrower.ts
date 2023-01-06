import { Loan } from "../loan/loan";

export interface Borrower {
    id: string;
    name: string;
    loans: Loan[];
}