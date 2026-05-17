import {Temporal} from "@js-temporal/polyfill";

export interface GetVenueCalendarInput {
    venueId: string;
    from: Temporal.PlainDate;
    to: Temporal.PlainDate;
}
