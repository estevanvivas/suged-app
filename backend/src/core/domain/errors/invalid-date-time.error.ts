import {BaseError} from "@/core/domain/errors/base.error";

export class InvalidDateTimeError extends BaseError {
    constructor(message = "Fecha y hora invalidas") {
        super(message, "INVALID_DATE_TIME");
    }
}

