import { Temporal } from "@js-temporal/polyfill";

export interface GetVenueAvailableTimeSlotsInput {
  venueId: string;
  date: Temporal.PlainDate;
}