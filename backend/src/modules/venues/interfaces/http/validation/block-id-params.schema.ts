import {z} from "zod";
import {uuidSchema} from "@shared/validation/uuid.schema";

export const blockIdParamsSchema = z.object({
    blockId: uuidSchema,
});

export type BlockIdParams = z.output<typeof blockIdParamsSchema>;