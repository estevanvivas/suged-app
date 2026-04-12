import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {UUID} from "@/core/domain/value-objects/uuid";
import {Time} from "@/core/domain/value-objects/time";
import {DateTime} from "@/core/domain/value-objects/date-time";

export class RecurringBlock {

    constructor(
        public readonly id: UUID,
        public venueId: UUID,
        public dayOfWeek: DayOfWeek,
        public startTime: Time,
        public endTime: Time,
        public reason: string | null,
        public createdAt: DateTime
    ) {
    }
}