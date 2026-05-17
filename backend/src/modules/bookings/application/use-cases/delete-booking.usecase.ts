import {DeleteBookingInput} from "@bookings-module/application/contracts/delete-booking.input";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class DeleteBookingUseCase {
    constructor(private readonly bookingRepository: BookingRepository) {
    }

    async execute(input: DeleteBookingInput): Promise<void> {
        const booking = await this.bookingRepository.findById(input.bookingId);
        if (!booking) {
            throw new NotFoundError("No se encontró la reserva", "BOOKING_NOT_FOUND");
        }

        await this.bookingRepository.delete(input.bookingId);
    }
}
