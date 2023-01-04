import { Borrower } from "../borrower/borrower";

export interface Loan {
    id: string;
    name: string;
    borrower?: Borrower
}
