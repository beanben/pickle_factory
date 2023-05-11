export interface Firm {
    id?: number,
    name: string
}

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