import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {GetMyBookingsInput} from "@bookings-module/application/contracts/get-my-bookings.input";
import {BookingViewMapper} from "@bookings-module/application/mappers/booking-view.mapper";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";

export class GetMyBookingsUseCase {
    constructor(private readonly bookingRepository: BookingRepository) {
    }

    async execute(input: GetMyBookingsInput): Promise<BookingView[]> {
        const bookings = await this.bookingRepository.findByUserId(input.userId);
        return bookings.map(BookingViewMapper.toView);
    }
}
