import {BaseError} from "@/core/domain/errors/base.error";

export class InvalidUUIDError extends BaseError {
    constructor() {
        super("El identificador UUID proporcionado no es válido.", "InvalidUUIDError");
    }
}