import {DateTime} from 'luxon';

export class TimeSlot {
    constructor(
        public readonly start: DateTime,
        public readonly end: DateTime
    ) {
    }

    overlaps(other: TimeSlot): boolean {
        return (
            this.start < other.end &&
            other.start < this.end
        );
    }
}