import {BaseError} from "./BaseError";

export class InvalidOperationError extends BaseError {
    constructor(
        message = "Invalid operation",
        code = "INVALID_OPERATION"
    ) {
        super(message, code);
    }
}