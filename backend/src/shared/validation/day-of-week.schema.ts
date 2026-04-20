import z from "zod";

export const dayOfWeekSchema = z
    .number("Día de la semana inválido (debe ser un número entre 1 y 7)")
    .int("El día de la semana debe ser un entero")
    .min(1, "Día de la semana inválido (1-7)")
    .max(7, "Día de la semana inválido (1-7)");