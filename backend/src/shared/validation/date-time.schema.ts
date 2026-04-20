import {Temporal} from "@js-temporal/polyfill";
import {z} from "zod";

export const plainDateStringSchema = z.iso.date({
    message: "La fecha debe tener formato ISO YYYY-MM-DD.",
});

export const plainTimeStringSchema = z.iso.time({
    message: "La hora debe tener formato ISO HH:mm:ss.",
    precision: 0,
});

export const plainDateSchema = plainDateStringSchema.transform((value) =>
    Temporal.PlainDate.from(value)
);

export const plainTimeSchema = plainTimeStringSchema.transform((value) =>
    Temporal.PlainTime.from(value)
);