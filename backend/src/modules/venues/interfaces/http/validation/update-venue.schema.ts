import {z} from "zod";

export const updateVenueBodySchema = z.object({
    name: z.string({
        error: "El nombre debe ser un texto.",
    }).trim().min(1, {message: "El nombre no puede estar vacío."}),
    description: z.string({
        error: "La descripción debe ser un texto.",
    }).trim().min(1, {message: "La descripción no puede estar vacía."}),
    capacity: z.number({
        error: "La capacidad debe ser un número.",
    }).int({message: "La capacidad debe ser un número entero."})
        .positive({message: "La capacidad debe ser un entero positivo."}),
}).partial().refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {message: "Debes enviar al menos un campo para actualizar."}
);

export type UpdateVenueBody = z.output<typeof updateVenueBodySchema>;