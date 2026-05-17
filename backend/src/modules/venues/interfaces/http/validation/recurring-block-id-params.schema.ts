import {z} from "zod";

import {uuidSchema} from "@shared/validation/uuid.schema";

export const recurringBlockIdParamsSchema = z.object({
    recurringBlockId: uuidSchema,
});

export type RecurringBlockIdParams = z.output<typeof recurringBlockIdParamsSchema>;
