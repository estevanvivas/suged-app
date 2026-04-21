import {z} from 'zod';
import {plainDateSchema, plainTimeSchema} from "@shared/validation/date-time.schema";

export const createVenueBlockBodySchema = z.object({
    date: plainDateSchema,
    startTime: plainTimeSchema,
    endTime: plainTimeSchema,
    reason: z.string().optional()
}).refine(
    (data) => data.startTime < data.endTime,
    {
        message: "La hora de inicio del bloqueo debe ser anterior a la hora de finalización."
    })

export type CreateVenueBlockBody = z.output<typeof createVenueBlockBodySchema>;