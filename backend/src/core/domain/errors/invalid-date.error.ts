import {BaseError} from "@/core/domain/errors/base.error";

export class InvalidDateError extends BaseError {
    constructor(message = "Fecha o formato invalido") {
        super(message, "INVALID_DATE");
    }
}
