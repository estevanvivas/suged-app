import {Temporal} from "@js-temporal/polyfill";

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
}