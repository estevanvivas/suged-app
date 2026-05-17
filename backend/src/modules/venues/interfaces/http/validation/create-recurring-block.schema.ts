import {Temporal} from "@js-temporal/polyfill";
import {z} from "zod";

import {dayOfWeekSchema} from "@shared/validation/day-of-week.schema";
import {plainTimeSchema} from "@shared/validation/date-time.schema";

export const createRecurringBlockBodySchema = z.object({
    dayOfWeek: dayOfWeekSchema,
    startTime: plainTimeSchema,
    endTime: plainTimeSchema,
    reason: z.string().optional(),
}).refine(
    (data) => Temporal.PlainTime.compare(data.startTime, data.endTime) < 0,
    {
        message: "La hora de inicio del bloqueo debe ser anterior a la hora de finalizacion.",
    }
);

export type CreateRecurringBlockBody = z.output<typeof createRecurringBlockBodySchema>;
