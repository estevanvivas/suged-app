import {Temporal} from "@js-temporal/polyfill";

export interface CreateVenueBlockInput {
    venueId: string,
    date: Temporal.PlainDate,
    startTime: Temporal.PlainTime,
    endTime: Temporal.PlainTime,
    reason?: string
}