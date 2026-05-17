import {Temporal} from "@js-temporal/polyfill";
import {z} from "zod";

import {plainDateStringSchema} from "@shared/validation/date-time.schema";

export const getVenueCalendarQuerySchema = z.object({
    from: plainDateStringSchema,
    to: plainDateStringSchema,
}).refine(
    (data) => Temporal.PlainDate.compare(
        Temporal.PlainDate.from(data.from),
        Temporal.PlainDate.from(data.to)
    ) <= 0,
    {
        message: "La fecha inicial debe ser anterior o igual a la fecha final.",
    }
);

export type GetVenueCalendarQuery = z.output<typeof getVenueCalendarQuerySchema>;
