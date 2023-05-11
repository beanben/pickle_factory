export interface APIResult {
    response: any,
    token: string;
    status: "error" | "success";
    message: string;
}
