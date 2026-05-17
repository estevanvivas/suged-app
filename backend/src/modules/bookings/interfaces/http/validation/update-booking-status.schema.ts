import {z} from "zod";

export const updateBookingStatusBodySchema = z.object({
    estado: z.enum([
        "PENDIENTE_APROBACION",
        "APROBADA",
        "RECHAZADA",
    ]),
});

export type UpdateBookingStatusBody = z.output<typeof updateBookingStatusBodySchema>;
