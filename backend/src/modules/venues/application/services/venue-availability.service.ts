import {Temporal} from "@js-temporal/polyfill";
import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";

type Interval = {
    start: number;
    end: number;
};

export class VenueAvailabilityService {
    constructor(
        private readonly venueRepository: VenueRepository,
        private readonly bookingRepository: BookingRepository
    ) {
    }

    async getAvailableTimeSlots(venueId: string, date: Temporal.PlainDate): Promise<TimeSlotView[]> {
        const dayOfWeek = this.toDayOfWeek(date);

        const schedule = await this.venueRepository.getScheduleByDay(venueId, dayOfWeek);

        if (!schedule) {
            return [];
        }

        const [blocks, recurringBlocks, bookings] = await Promise.all([
            this.venueRepository.findBlocksForDate(venueId, date.toString()),
            this.venueRepository.findRecurringBlocksByDay(venueId, dayOfWeek),
            this.bookingRepository.findForVenueOnDate(venueId, date),
        ]);

        const occupiedIntervals: Interval[] = [
            ...blocks.map(block => this.toInterval(block.startTime, block.endTime)),
            ...recurringBlocks.map(block => this.toInterval(block.startTime, block.endTime)),
            ...bookings.map(booking => this.toInterval(booking.startTime, booking.endTime)),
        ];

        return this.generateHourlySlots(
            schedule.openingTime,
            schedule.closingTime,
            occupiedIntervals
        );
    }

    private toDayOfWeek(date: Temporal.PlainDate): DayOfWeek {
        return date.dayOfWeek as DayOfWeek;
    }

    private generateHourlySlots(
        openingTime: Temporal.PlainTime,
        closingTime: Temporal.PlainTime,
        occupiedIntervals: Interval[]
    ): TimeSlotView[] {
        const slotDuration = 60;
        const slots: TimeSlotView[] = [];

        let current = this.timeToMinutes(openingTime);
        const closing = this.timeToMinutes(closingTime);

        if (closing <= current) {
            return [];
        }

        while (current + slotDuration <= closing) {
            const start = current;
            const end = current + slotDuration;

            const overlaps = occupiedIntervals.some(interval => start < interval.end && end > interval.start);

            if (!overlaps) {
                slots.push({
                    startTime: this.minutesToTime(start),
                    endTime: this.minutesToTime(end),
                    label: `${this.formatLabel(start)} - ${this.formatLabel(end)}`,
                });
            }

            current += slotDuration;
        }

        return slots;
    }

    private toInterval(startTime: Temporal.PlainTime, endTime: Temporal.PlainTime): Interval {
        return {
            start: this.timeToMinutes(startTime),
            end: this.timeToMinutes(endTime),
        };
    }

    private timeToMinutes(time: Temporal.PlainTime): number {
        return time.hour * 60 + time.minute;
    }

    private minutesToTime(minutes: number): string {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;

        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
    }

    private formatLabel(minutes: number): string {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;

        return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
}

