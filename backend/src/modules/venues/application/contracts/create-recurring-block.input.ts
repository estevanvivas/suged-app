import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {Temporal} from "@js-temporal/polyfill";

export interface CreateRecurringBlockInput {
    venueId: string;
    dayOfWeek: DayOfWeek;
    startTime: Temporal.PlainTime;
    endTime: Temporal.PlainTime;
    reason?: string;
}
