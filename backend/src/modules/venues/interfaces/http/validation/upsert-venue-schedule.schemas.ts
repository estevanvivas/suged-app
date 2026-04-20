import {z} from "zod";
import {uuidSchema} from "@shared/validation/uuid.schema";
import {Temporal} from "@js-temporal/polyfill";
import {plainTimeSchema} from "@shared/validation/date-time.schema";
import {dayOfWeekSchema} from "@shared/validation/day-of-week.schema";

export const upsertVenueScheduleParamsSchema = z.object({
    venueId: uuidSchema
})

export const upsertVenueScheduleBodySchema = z.object({
    dayOfWeek: dayOfWeekSchema,
    openingTime: plainTimeSchema,
    closingTime: plainTimeSchema,
}).refine(
    (data) => Temporal.PlainTime.compare(data.openingTime, data.closingTime) < 0,
    {
        message: "La hora de apertura debe ser anterior a la hora de cierre.",
    })

export type UpsertVenueScheduleBody = z.output<typeof upsertVenueScheduleBodySchema>;
export type UpsertVenueScheduleParams = z.output<typeof upsertVenueScheduleParamsSchema>;