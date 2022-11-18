import { Firm } from "./firm";

export interface User {
    pk?: number,
    firm: Firm,
    first_name?: string,
    last_name?: string,
    email: string,
    password: string,
    password_confirm?: string,
    token?: string
}
