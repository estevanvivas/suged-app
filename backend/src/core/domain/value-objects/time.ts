import {DateTime as LuxonDateTime} from "luxon";
import {InvalidTimeError} from "@/core/domain/errors/invalid-time.error";

export class Time {
    private static readonly TIME_FORMAT = "HH:mm";

    static format(): string {
        return this.TIME_FORMAT;
    }

    private constructor(
        public readonly value: string
    ) {}

    private get parsedTime(): LuxonDateTime {
        return LuxonDateTime.fromFormat(this.value, Time.format(), {zone: "utc"});
    }

    static create(value: string): Time {
        const dt = LuxonDateTime.fromFormat(value, Time.format(), {zone: "utc"});

        if (!dt.isValid) {
            throw new InvalidTimeError("La hora no es valida.");
        }

        if (dt.toFormat(this.format()) !== value) {
            throw new InvalidTimeError(`Formato de hora invalido. Use ${Time.format()}.`);
        }

        return new Time(value);
    }

    isBefore(other: Time): boolean {
        return this.parsedTime.toMillis() < other.parsedTime.toMillis();
    }

    isAfter(other: Time): boolean {
        return this.parsedTime.toMillis() > other.parsedTime.toMillis();
    }

    equals(other: Time): boolean {
        return this.value === other.value;
    }
}