import { z } from "zod";
import { uuidSchema } from "@shared/validation/uuid.schema";

export const venueIdParamsSchema = z.object({
  venueId: uuidSchema,
});

export type VenueIdParams = z.output<typeof venueIdParamsSchema>;