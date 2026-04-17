import {BaseError} from "./BaseError";

export class DatabaseError extends BaseError {
    constructor(message: string = "Error al procesar la operación en la base de datos", code: string = "DB_ERROR") {
        super(message, code);
    }
}

export class DatabaseQueryError extends DatabaseError {
    constructor(message = "Error ejecutando consulta de base de datos") {
        super(message, "DB_QUERY_FAILED");
    }
}

export class DatabaseUnavailableError extends DatabaseError {
    constructor(message = "Base de datos no disponible") {
        super(message, "DB_UNAVAILABLE");
    }
}