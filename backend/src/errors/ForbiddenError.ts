import {BaseError} from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(message = "Forbidden", code = "FORBIDDEN") {
        super(message, code);
    }
}