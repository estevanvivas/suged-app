import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {Temporal} from "@js-temporal/polyfill";

export interface UpsertVenueScheduleInput {
    venueId: string;
    dayOfWeek: DayOfWeek;
    openingTime: Temporal.PlainTime;
    closingTime: Temporal.PlainTime;
}