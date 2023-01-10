import { Borrower } from "../borrower/borrower";
import { Scheme } from "../scheme/scheme";

export interface Loan {
    id: string;
    name: string;
    borrower?: Borrower;
    schemes?: Scheme[];
}
