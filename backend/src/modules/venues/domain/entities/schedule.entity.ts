import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {Temporal} from "@js-temporal/polyfill";
import {randomUUID} from "node:crypto";

export class Schedule {

    constructor(
        public readonly id: string,
        public venueId: string,
        public dayOfWeek: DayOfWeek,
        public openingTime: Temporal.PlainTime,
        public closingTime: Temporal.PlainTime,
    ) {
    }

    static create(data: {
        venueId: string;
        dayOfWeek: DayOfWeek;
        openingTime: Temporal.PlainTime;
        closingTime: Temporal.PlainTime;
    }) {
        return new Schedule(
            randomUUID(),
            data.venueId,
            data.dayOfWeek,
            data.openingTime,
            data.closingTime,
        )
    }
}