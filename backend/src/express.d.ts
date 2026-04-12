export {};

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                rol: string | null;
            };
        }
    }
}