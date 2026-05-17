import {z} from "zod";

export const updateBookingStatusBodySchema = z.object({
    status: z.enum([
        "APROBACION_PENDIENTE",
        "APROBADA",
        "RECHAZADA",
        "CANCELADA",
    ]),
});

export type UpdateBookingStatusBody = z.output<typeof updateBookingStatusBodySchema>;
