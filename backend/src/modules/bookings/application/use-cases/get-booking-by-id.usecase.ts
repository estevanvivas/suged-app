import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {GetBookingByIdInput} from "@bookings-module/application/contracts/get-booking-by-id.input";
import {BookingViewMapper} from "@bookings-module/application/mappers/booking-view.mapper";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {ForbiddenError} from "@shared/errors/ForbiddenError";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class GetBookingByIdUseCase {
    constructor(private readonly bookingRepository: BookingRepository) {
    }

    async execute(input: GetBookingByIdInput): Promise<BookingView> {
        const booking = await this.bookingRepository.findById(input.bookingId);
        if (!booking) {
            throw new NotFoundError("No se encontró la reserva", "BOOKING_NOT_FOUND");
        }

        if (booking.userId !== input.requesterId) {
            throw new ForbiddenError("No tienes permisos para consultar esta reserva.");
        }

        return BookingViewMapper.toView(booking);
    }
}
