import {Temporal} from "@js-temporal/polyfill";
import {z} from "zod";

import {dayOfWeekSchema} from "@shared/validation/day-of-week.schema";
import {plainTimeSchema} from "@shared/validation/date-time.schema";

export const updateRecurringBlockBodySchema = z.object({
    dayOfWeek: dayOfWeekSchema.optional(),
    startTime: plainTimeSchema.optional(),
    endTime: plainTimeSchema.optional(),
    reason: z.string().nullable().optional(),
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "Debes enviar al menos un campo para actualizar.",
    }
).refine(
    (data) => {
        if (!data.startTime || !data.endTime) return true;
        return Temporal.PlainTime.compare(data.startTime, data.endTime) < 0;
    },
    {
        message: "La hora de inicio del bloqueo debe ser anterior a la hora de finalizacion.",
    }
);

export type UpdateRecurringBlockBody = z.output<typeof updateRecurringBlockBodySchema>;
