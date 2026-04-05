export interface HttpErrorResponse {
    code: string;
    error: string;
    details?: Record<string, string[]>;
}