import {z} from "zod";

export const createVenueBodySchema = z.object({
    name: z.string({
        error: (issue) => issue.input === undefined
            ? "El nombre es obligatorio."
            : "El nombre debe ser un texto.",
    }).trim().min(1, {message: "El nombre no puede estar vacío."}),
    description: z.string({
        error: (issue) => issue.input === undefined
            ? "La descripción es obligatoria."
            : "La descripción debe ser un texto.",
    }).trim().min(1, {message: "La descripción no puede estar vacía."}),
    capacity: z.number({
        error: (issue) => issue.input === undefined
            ? "La capacidad es obligatoria."
            : "La capacidad debe ser un número.",
    }).int({message: "La capacidad debe ser un número entero."})
        .positive({message: "La capacidad debe ser un entero positivo."}),
});

export type CreateVenueBody = z.output<typeof createVenueBodySchema>;