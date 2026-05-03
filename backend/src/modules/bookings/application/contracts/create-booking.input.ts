import {Temporal} from "@js-temporal/polyfill";

export interface CreateBookingInput {
    userId: string;
    venueId: string;
    date: Temporal.PlainDate;
    startTime: Temporal.PlainTime;
    endTime: Temporal.PlainTime;
}
