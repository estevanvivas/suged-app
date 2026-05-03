import {Temporal} from "@js-temporal/polyfill";

import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {CreateBookingInput} from "@bookings-module/application/contracts/create-booking.input";
import {BookingViewMapper} from "@bookings-module/application/mappers/booking-view.mapper";
import {Booking} from "@bookings-module/domain/entities/booking.entity";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {ConflictError} from "@shared/errors/ConflictError";
import {InvalidOperationError} from "@shared/errors/InvalidOperationError";
import {NotFoundError} from "@shared/errors/NotFoundError";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";

type Interval = {
    startTime: Temporal.PlainTime;
    endTime: Temporal.PlainTime;
};

export class CreateBookingUseCase {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly venueRepository: VenueRepository
    ) {
    }

    async execute(input: CreateBookingInput): Promise<BookingView> {
        const venue = await this.venueRepository.findById(input.venueId);
        if (!venue) {
            throw new NotFoundError("No se encontró el escenario", "VENUE_NOT_FOUND");
        }

        if (venue.status !== "ACTIVE") {
            throw new InvalidOperationError(
                "El escenario no está disponible para reservas.",
                "VENUE_NOT_AVAILABLE"
            );
        }

        const schedule = await this.venueRepository.getScheduleByDay(input.venueId, input.date.dayOfWeek);
        if (!schedule) {
            throw new InvalidOperationError(
                "El escenario no tiene horario de atención para la fecha seleccionada.",
                "VENUE_SCHEDULE_NOT_CONFIGURED"
            );
        }

        if (
            this.compareTimes(input.startTime, schedule.openingTime) < 0 ||
            this.compareTimes(input.endTime, schedule.closingTime) > 0
        ) {
            throw new InvalidOperationError(
                "La reserva debe estar dentro del horario de atención del escenario.",
                "BOOKING_OUTSIDE_SCHEDULE"
            );
        }

        const [blocks, recurringBlocks, bookings] = await Promise.all([
            this.venueRepository.findBlocksForDate(input.venueId, input.date),
            this.venueRepository.findRecurringBlocksByDay(input.venueId, input.date.dayOfWeek),
            this.bookingRepository.findForVenueOnDate(input.venueId, input.date),
        ]);

        const occupiedIntervals: Interval[] = [
            ...blocks,
            ...recurringBlocks,
            ...bookings,
        ];

        const hasCollision = occupiedIntervals.some((interval) =>
            this.overlaps(input.startTime, input.endTime, interval.startTime, interval.endTime)
        );

        if (hasCollision) {
            throw new ConflictError(
                "La reserva se superpone con otra reserva, bloqueo o bloqueo recurrente existente.",
                "BOOKING_COLLISION"
            );
        }

        const booking = Booking.create({
            userId: input.userId,
            venueId: input.venueId,
            bookingDate: input.date,
            startTime: input.startTime,
            endTime: input.endTime,
        });

        const savedBooking = await this.bookingRepository.save(booking);

        return BookingViewMapper.toView(savedBooking);
    }

    private overlaps(
        startTime: Temporal.PlainTime,
        endTime: Temporal.PlainTime,
        existingStartTime: Temporal.PlainTime,
        existingEndTime: Temporal.PlainTime
    ): boolean {
        return this.compareTimes(startTime, existingEndTime) < 0 &&
            this.compareTimes(existingStartTime, endTime) < 0;
    }

    private compareTimes(left: Temporal.PlainTime, right: Temporal.PlainTime): number {
        return Temporal.PlainTime.compare(left, right);
    }
}
