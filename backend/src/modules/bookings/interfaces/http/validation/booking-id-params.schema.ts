import {z} from "zod";

import {uuidSchema} from "@shared/validation/uuid.schema";

export const bookingIdParamsSchema = z.object({
    bookingId: uuidSchema,
});

export type BookingIdParams = z.output<typeof bookingIdParamsSchema>;
