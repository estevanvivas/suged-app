import {z} from "zod";
import {plainDateStringSchema} from "@shared/validation/date-time.schema";

export const getVenueAvailableTimeSlotsQuerySchema = z.object({
    date: plainDateStringSchema,
});

export type GetVenueAvailableTimeSlotsQuery = z.output<
    typeof getVenueAvailableTimeSlotsQuerySchema
>;