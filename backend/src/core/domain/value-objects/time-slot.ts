import {DateTime} from "@/core/domain/value-objects/date-time";
import {InvalidDateTimeError} from "@/core/domain/errors/invalid-date-time.error";

export class TimeSlot {
    constructor(
        public readonly start: DateTime,
        public readonly end: DateTime
    ) {
        if (!start.isBefore(end)) {
            throw new InvalidDateTimeError("El inicio debe ser menor que el fin.");
        }
    }

    overlaps(other: TimeSlot): boolean {
        return this.start.isBefore(other.end) && other.start.isBefore(this.end);
    }
}