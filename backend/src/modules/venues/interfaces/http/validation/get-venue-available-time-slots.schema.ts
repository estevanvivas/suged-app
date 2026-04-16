import {z} from "zod";
import {uuidSchema} from "@shared/validation/uuid.schema";
import {plainDateStringSchema} from "@shared/validation/date-time.schema";

export const getVenueAvailableTimeSlotsParamsSchema = z.object({
    venueId: uuidSchema,
});

export const getVenueAvailableTimeSlotsQuerySchema = z.object({
    date: plainDateStringSchema,
});

export type GetVenueAvailableTimeSlotsParams = z.infer<
    typeof getVenueAvailableTimeSlotsParamsSchema
>;
export type GetVenueAvailableTimeSlotsQuery = z.infer<
    typeof getVenueAvailableTimeSlotsQuerySchema
>;