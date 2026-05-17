import {Temporal} from "@js-temporal/polyfill";
import {Booking, BookingStatus} from "@bookings-module/domain/entities/booking.entity";

export interface BookingRepository {
    findForVenueOnDate(
        venueId: string,
        date: Temporal.PlainDate
    ): Promise<Booking[]>;

    findById(id: string): Promise<Booking | null>;

    findByUserId(userId: string): Promise<Booking[]>;

    save(booking: Booking): Promise<Booking>;

    updateStatus(id: string, status: BookingStatus): Promise<Booking>;

    updateSchedule(
        id: string,
        date: Temporal.PlainDate,
        startTime: Temporal.PlainTime,
        endTime: Temporal.PlainTime
    ): Promise<Booking>;

    delete(id: string): Promise<void>;
}
