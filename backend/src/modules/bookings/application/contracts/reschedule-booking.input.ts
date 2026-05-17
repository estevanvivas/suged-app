import {Temporal} from "@js-temporal/polyfill";

export interface RescheduleBookingInput {
    bookingId: string;
    requesterId: string;
    date: Temporal.PlainDate;
    startTime: Temporal.PlainTime;
    endTime: Temporal.PlainTime;
}
