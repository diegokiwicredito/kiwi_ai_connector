export interface ResponseEndpoint {
    success: boolean;
    data: any;
    code: number;
    message?: string;
}