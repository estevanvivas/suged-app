import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {Booking} from "@bookings-module/domain/entities/booking.entity";

export class BookingViewMapper {
    static toView(booking: Booking): BookingView {
        return {
            id: booking.id,
            userId: booking.userId,
            venueId: booking.venueId,
            date: booking.bookingDate.toString(),
            startTime: booking.startTime.toString(),
            endTime: booking.endTime.toString(),
            status: booking.status,
            qrToken: booking.qrToken,
            createdAt: booking.createdAt.toString(),
        };
    }
}
