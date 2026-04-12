import {DateTime as LuxonDateTime} from "luxon";
import {CalendarDate} from "@/core/domain/value-objects/calendar-date";
import {Time} from "@/core/domain/value-objects/time";
import {InvalidDateTimeError} from "@/core/domain/errors/invalid-date-time.error";

export class DateTime {
    private static readonly DATE_TIME_FORMAT = `${CalendarDate.format()}'T'${Time.format()}`;

    private constructor(
        public readonly value: string
    ) {
    }

    static format(): string {
        return DateTime.DATE_TIME_FORMAT;
    }

    static create(value: string): DateTime {
        const dt = LuxonDateTime.fromFormat(value, DateTime.format(), {zone: "utc"});

        if (!dt.isValid) {
            throw new InvalidDateTimeError("La fecha y hora no son validas.");
        }

        if (dt.toFormat(DateTime.format()) !== value) {
            throw new InvalidDateTimeError(`Formato invalido. Use ${DateTime.format()}.`);
        }

        return new DateTime(dt.toFormat(DateTime.format()));
    }

    static fromParts(date: CalendarDate, time: Time): DateTime {
        const parsedTime = LuxonDateTime.fromFormat(time.value, Time.format(), {zone: "utc"});

        const dt = LuxonDateTime.fromObject(
            {
                year: date.year,
                month: date.month,
                day: date.day,
                hour: parsedTime.hour,
                minute: parsedTime.minute,
            },
            {zone: "utc"}
        );

        return DateTime.create(dt.toFormat(DateTime.format()));
    }

    static now(): DateTime {
        return DateTime.create(LuxonDateTime.now().toUTC().toFormat(DateTime.format()));
    }

    private get parsedDateTime(): LuxonDateTime {
        return LuxonDateTime.fromFormat(this.value, DateTime.format(), {zone: "utc"});
    }

    get date(): CalendarDate {
        return CalendarDate.create(this.parsedDateTime.toFormat(CalendarDate.format()));
    }

    get time(): Time {
        return Time.create(this.parsedDateTime.toFormat(Time.format()));
    }


    isBefore(other: DateTime): boolean {
        return this.value < other.value;
    }

    isAfter(other: DateTime): boolean {
        return this.value > other.value;
    }

    equals(other: DateTime): boolean {
        return this.value === other.value;
    }
}

