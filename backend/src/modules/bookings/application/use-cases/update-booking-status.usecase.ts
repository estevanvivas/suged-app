import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {UpdateBookingStatusInput} from "@bookings-module/application/contracts/update-booking-status.input";
import {BookingViewMapper} from "@bookings-module/application/mappers/booking-view.mapper";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class UpdateBookingStatusUseCase {
    constructor(private readonly bookingRepository: BookingRepository) {
    }

    async execute(input: UpdateBookingStatusInput): Promise<BookingView> {
        const booking = await this.bookingRepository.findById(input.bookingId);
        if (!booking) {
            throw new NotFoundError("No se encontro la reserva", "BOOKING_NOT_FOUND");
        }

        const updatedBooking = await this.bookingRepository.updateStatus(
            input.bookingId,
            input.status
        );

        return BookingViewMapper.toView(updatedBooking);
    }
}
