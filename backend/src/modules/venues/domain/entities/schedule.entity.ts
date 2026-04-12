import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {UUID} from "@/core/domain/value-objects/uuid";
import {Time} from "@/core/domain/value-objects/time";

export class Schedule {

    constructor(
        public readonly id: UUID,
        public venueId: UUID,
        public dayOfWeek: DayOfWeek,
        public openingTime: Time,
        public closingTime: Time
    ) {}
}