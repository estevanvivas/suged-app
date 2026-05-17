import {Temporal} from "@js-temporal/polyfill";
import {Booking, BookingStatus} from "@bookings-module/domain/entities/booking.entity";

export interface BookingRepository {
    findForVenueOnDate(
        venueId: string,
        date: Temporal.PlainDate
    ): Promise<Booking[]>;

    findById(id: string): Promise<Booking | null>;

    save(booking: Booking): Promise<Booking>;

    updateStatus(id: string, status: BookingStatus): Promise<Booking>;
}
