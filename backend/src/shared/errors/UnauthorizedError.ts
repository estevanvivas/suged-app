import {BaseError} from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
        super(message, code);
    }
}