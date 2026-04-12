import {UUID} from "@/core/domain/value-objects/uuid";
import {DateTime} from "@/core/domain/value-objects/date-time";
import {Time} from "@/core/domain/value-objects/time";

export class Block {

    constructor(
        public readonly id: UUID,
        public venueId: UUID,
        public date: DateTime,
        public startTime: Time,
        public endTime: Time,
        public reason: string | null
    ) {
    }
}