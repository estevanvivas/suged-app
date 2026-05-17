import {z} from "zod";

import {recurringBlockIdParamsSchema} from "@venues-module/interfaces/http/validation/recurring-block-id-params.schema";
import {venueIdParamsSchema} from "@venues-module/interfaces/http/validation/venue-id-params.schema";

export const recurringBlockParamsSchema = venueIdParamsSchema.extend(recurringBlockIdParamsSchema.shape);

export type RecurringBlockParams = z.output<typeof recurringBlockParamsSchema>;
