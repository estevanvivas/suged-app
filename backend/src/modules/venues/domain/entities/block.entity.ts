import {Temporal} from "@js-temporal/polyfill";
import {randomUUID} from "node:crypto";

export class Block {

    constructor(
        public readonly id: string,
        public venueId: string,
        public date: Temporal.PlainDate,
        public startTime: Temporal.PlainTime,
        public endTime: Temporal.PlainTime,
        public reason: string | null
    ) {
    }

    static create(data: {
        venueId: string,
        date: Temporal.PlainDate,
        startTime: Temporal.PlainTime,
        endTime: Temporal.PlainTime,
        reason: string | null
    }) {
        return new Block(
            randomUUID(),
            data.venueId,
            data.date,
            data.startTime,
            data.endTime,
            data.reason,
        )
    }
}