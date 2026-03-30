import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    PORT: z
        .string()
        .transform(Number)
        .refine((val) => !isNaN(val), {
            message: "PORT must be a number",
        }),
});

export const env = schema.parse(process.env);