import { Temporal } from "@js-temporal/polyfill";
import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {randomUUID} from "node:crypto";

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

    static create(data: {
        venueId: string;
        dayOfWeek: DayOfWeek;
        startTime: Temporal.PlainTime;
        endTime: Temporal.PlainTime;
        reason: string | null;
    }): RecurringBlock {
        return new RecurringBlock(
            randomUUID(),
            data.venueId,
            data.dayOfWeek,
            data.startTime,
            data.endTime,
            data.reason,
            Temporal.Now.instant()
        );
    }
}
