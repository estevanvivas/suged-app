import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { HttpErrorResponse } from "../types/HttpErrorResponse";

export const validateBody = (schema: z.ZodType) => {
    return (req: Request, res: Response<HttpErrorResponse>, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const { fieldErrors } = result.error.flatten();

            const details = Object.fromEntries(
                Object.entries(fieldErrors).filter(([_, v]) => v !== undefined)
            ) as Record<string, string[]>;

            return res.status(400).json({
                code: "VALIDATION_ERROR",
                error: "Error de validación",
                details,
            });
        }

        req.body = result.data;
        next();
    };
};