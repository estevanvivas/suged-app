import {BaseError} from "@/core/domain/errors/base.error";

export class InvalidTimeError extends BaseError {
    constructor(message = "Hora o formato invalido") {
        super(message, "INVALID_TIME");
    }
}