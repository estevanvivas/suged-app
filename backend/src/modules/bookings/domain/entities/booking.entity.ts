import {Temporal} from "@js-temporal/polyfill";
import {randomUUID} from "node:crypto";

export class Booking {

    constructor(
        public readonly id: string,
        public userId: string,
        public venueId: string,
        public bookingDate: Temporal.PlainDate,
        public startTime: Temporal.PlainTime,
        public endTime: Temporal.PlainTime,
        public status: BookingStatus,
        public qrToken: string,
        public createdAt: Temporal.Instant
    ) {
    }

    static create(data: {
        userId: string;
        venueId: string;
        bookingDate: Temporal.PlainDate;
        startTime: Temporal.PlainTime;
        endTime: Temporal.PlainTime;
    }): Booking {
        return new Booking(
            randomUUID(),
            data.userId,
            data.venueId,
            data.bookingDate,
            data.startTime,
            data.endTime,
            "APROBACION_PENDIENTE",
            randomUUID(),
            Temporal.Now.instant()
        );
    }
}

export type BookingStatus =
    | "APROBACION_PENDIENTE"
    | "APROBADA"
    | "RECHAZADA"
    | "CANCELADA";
