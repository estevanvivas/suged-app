import {Temporal} from "@js-temporal/polyfill";

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
}

export type BookingStatus =
    | 'PENDING_APPROVAL'
    | 'APPROVED'
    | 'REJECTED';