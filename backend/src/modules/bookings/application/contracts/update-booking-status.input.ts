import {BookingStatus} from "@bookings-module/domain/entities/booking.entity";

export interface UpdateBookingStatusInput {
    bookingId: string;
    status: BookingStatus;
}
