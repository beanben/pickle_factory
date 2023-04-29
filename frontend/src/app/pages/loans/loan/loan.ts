import { Borrower } from "../../borrowers/borrower/borrower";
import { Scheme } from "./scheme/scheme";

export interface Loan {
    id: number;
    slug: string;   
    name: string;
    borrower?: Borrower;
    // schemes: Scheme[]
}
