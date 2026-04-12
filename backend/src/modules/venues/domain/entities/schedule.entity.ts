import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {Temporal} from "@js-temporal/polyfill";

export class Schedule {

    constructor(
        public readonly id: string,
        public venueId: string,
        public dayOfWeek: DayOfWeek,
        public openingTime: Temporal.PlainTime,
        public closingTime: Temporal.PlainTime,
    ) {}
}