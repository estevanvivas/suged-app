import {Temporal} from "@js-temporal/polyfill";
import {Booking} from "@bookings-module/domain/entities/booking.entity";

export interface BookingRepository {
    findForVenueOnDate(
        venueId: string,
        date: Temporal.PlainDate
    ): Promise<Booking[]>;
}