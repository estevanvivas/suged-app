import {Temporal} from "@js-temporal/polyfill";
import {z} from "zod";

import {plainDateSchema, plainTimeSchema} from "@shared/validation/date-time.schema";
import {uuidSchema} from "@shared/validation/uuid.schema";

export const createBookingBodySchema = z.object({
    venueId: uuidSchema,
    date: plainDateSchema,
    startTime: plainTimeSchema,
    endTime: plainTimeSchema,
}).refine(
    (data) => Temporal.PlainTime.compare(data.startTime, data.endTime) < 0,
    {
        message: "La hora de inicio de la reserva debe ser anterior a la hora de finalización.",
    }
);

export type CreateBookingBody = z.output<typeof createBookingBodySchema>;
