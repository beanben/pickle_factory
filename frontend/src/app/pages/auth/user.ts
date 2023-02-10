import { Firm } from "./firm";

export interface User {
    pk?: number,
    firm: Firm,
    firstName?: string,
    lastName?: string,
    email: string,
    password: string,
    passwordConfirm?: string,
    token?: string
}
