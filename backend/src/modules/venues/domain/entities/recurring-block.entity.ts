import { Temporal } from "@js-temporal/polyfill";
import {DayOfWeek} from "@/core/domain/enums/day-of-week";

export class RecurringBlock {

    constructor(
        public readonly id: string,
        public venueId: string,
        public dayOfWeek: DayOfWeek,
        public startTime: Temporal.PlainTime,
        public endTime: Temporal.PlainTime,
        public reason: string | null,
        public createdAt: Temporal.Instant
    ) {
    }
}