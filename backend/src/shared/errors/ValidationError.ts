import {BaseError} from "./BaseError";

export class ValidationError extends BaseError {
    constructor(message = "Validation error", code = "VALIDATION_ERROR") {
        super(message, code);
    }
}