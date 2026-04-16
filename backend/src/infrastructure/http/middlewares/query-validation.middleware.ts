import type {RequestHandler} from "express";
import {z} from "zod";

export const validateQuery = (schema: z.ZodTypeAny): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const {fieldErrors} = result.error.flatten();

            const details = Object.fromEntries(
                Object.entries(fieldErrors).filter(([_, v]) => v !== undefined)
            ) as Record<string, string[]>;

            return res.status(400).json({
                code: "VALIDATION_ERROR",
                error: "Error de validacion",
                details,
            });
        }

        req.query = result.data as typeof req.query;
        next();
    };
};