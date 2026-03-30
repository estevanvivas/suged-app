import {BaseError} from "./BaseError";

export class NotFoundError extends BaseError {
    constructor(message = "Resource not found", code = "NOT_FOUND") {
        super(message, code);
    }
}