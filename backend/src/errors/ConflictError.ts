import {BaseError} from "./BaseError";

export class ConflictError extends BaseError {
    constructor(message = "Conflict", code = "CONFLICT") {
        super(message, code);
    }
}