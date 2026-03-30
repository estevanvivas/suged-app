import "dotenv/config";
import { z } from "zod";

const schema = z.object({
    PORT: z
        .string()
        .transform(Number)
        .refine((val) => !isNaN(val), {
            message: "PORT must be a number",
        }),

    SUPABASE_URL: z.url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export const env = schema.parse(process.env);