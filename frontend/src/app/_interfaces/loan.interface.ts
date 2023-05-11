export interface Loan {
    id: number;
    slug: string;   
    name: string;
    borrower_id?: number;
}

export interface Borrower {
    id: number;
    name: string;
}