import type {NextFunction, Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {HttpErrorResponse} from "../types/HttpErrorResponse";
import {BaseError} from "../../../shared/errors/BaseError";
import {UnauthorizedError} from "../../../shared/errors/UnauthorizedError";
import {ForbiddenError} from "../../../shared/errors/ForbiddenError";
import {NotFoundError} from "../../../shared/errors/NotFoundError";
import {ConflictError} from "../../../shared/errors/ConflictError";
import {InvalidOperationError} from "../../../shared/errors/InvalidOperationError";

const mapDomainErrorToStatus = (error: BaseError): number => {
    if (error instanceof UnauthorizedError) return StatusCodes.UNAUTHORIZED;
    if (error instanceof ForbiddenError) return StatusCodes.FORBIDDEN;
    if (error instanceof NotFoundError) return StatusCodes.NOT_FOUND;
    if (error instanceof ConflictError) return StatusCodes.CONFLICT;
    if (error instanceof InvalidOperationError) return StatusCodes.UNPROCESSABLE_ENTITY;

    return StatusCodes.INTERNAL_SERVER_ERROR;
};

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response<HttpErrorResponse>,
    _next: NextFunction
) => {
    if (err instanceof BaseError) {
        const status = mapDomainErrorToStatus(err);

        return res.status(status).json({
            code: err.code,
            error: err.message,
        });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        code: "INTERNAL_SERVER_ERROR",
        error: "Se ha producido un error interno del servidor.",
    });
};