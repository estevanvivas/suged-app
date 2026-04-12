import {InvalidDateError} from "@/core/domain/errors/invalid-date.error";
import { DateTime as LuxonDateTime } from "luxon";

export class CalendarDate {
    private static readonly DATE_FORMAT = "yyyy-MM-dd";

    static format(): string {
        return this.DATE_FORMAT;
    }

    private constructor(
        public readonly value: string,
    ) {
    }

    private get parsedDate(): LuxonDateTime {
        return LuxonDateTime.fromFormat(this.value, CalendarDate.format(), {zone: "utc"});
    }

    static create(value: string): CalendarDate {
        const dt = LuxonDateTime.fromFormat(value, CalendarDate.format(), {zone: "utc"});

        if (!dt.isValid) {
            throw new InvalidDateError("La fecha no es valida.");
        }

        if (dt.toFormat(this.format()) !== value) {
            throw new InvalidDateError(`Formato de fecha invalido. Use ${CalendarDate.format()}.`);
        }

        return new CalendarDate(value);
    }

    get year() {
        return this.parsedDate.year;
    }

    get month() {
        return this.parsedDate.month;
    }

    get day() {
        return this.parsedDate.day;
    }

    isAfter(date: CalendarDate) {
        return this.value > date.value;
    }

    isBefore(date: CalendarDate) {
        return this.value < date.value;
    }
}