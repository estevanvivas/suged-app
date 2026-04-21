import {z} from "zod";
import {plainTimeSchema} from "@shared/validation/date-time.schema";
import {dayOfWeekSchema} from "@shared/validation/day-of-week.schema";

export const upsertVenueScheduleBodySchema = z.object({
    dayOfWeek: dayOfWeekSchema,
    openingTime: plainTimeSchema,
    closingTime: plainTimeSchema,
}).refine(
    (data) => data.openingTime < data.closingTime,
    {
        message: "La hora de apertura debe ser anterior a la hora de cierre.",
    })

export type UpsertVenueScheduleBody = z.output<typeof upsertVenueScheduleBodySchema>;
