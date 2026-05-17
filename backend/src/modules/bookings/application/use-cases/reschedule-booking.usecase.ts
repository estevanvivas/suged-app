import {Temporal} from "@js-temporal/polyfill";

import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {RescheduleBookingInput} from "@bookings-module/application/contracts/reschedule-booking.input";
import {BookingViewMapper} from "@bookings-module/application/mappers/booking-view.mapper";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {ConflictError} from "@shared/errors/ConflictError";
import {ForbiddenError} from "@shared/errors/ForbiddenError";
import {InvalidOperationError} from "@shared/errors/InvalidOperationError";
import {NotFoundError} from "@shared/errors/NotFoundError";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";

type Interval = {
    id?: string;
    startTime: Temporal.PlainTime;
    endTime: Temporal.PlainTime;
};

export class RescheduleBookingUseCase {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly venueRepository: VenueRepository
    ) {
    }

    async execute(input: RescheduleBookingInput): Promise<BookingView> {
        const booking = await this.bookingRepository.findById(input.bookingId);
        if (!booking) {
            throw new NotFoundError("No se encontró la reserva", "BOOKING_NOT_FOUND");
        }

        if (booking.userId !== input.requesterId) {
            throw new ForbiddenError("No tienes permisos para reprogramar esta reserva.");
        }

        if (booking.status === "CANCELADA" || booking.status === "RECHAZADA") {
            throw new InvalidOperationError(
                "No se puede reprogramar una reserva cancelada o rechazada.",
                "BOOKING_CANNOT_BE_RESCHEDULED"
            );
        }

        const schedule = await this.venueRepository.getScheduleByDay(booking.venueId, input.date.dayOfWeek);
        if (!schedule) {
            throw new InvalidOperationError(
                "El escenario no tiene horario de atención para la fecha seleccionada.",
                "VENUE_SCHEDULE_NOT_CONFIGURED"
            );
        }

        if (
            Temporal.PlainTime.compare(input.startTime, schedule.openingTime) < 0 ||
            Temporal.PlainTime.compare(input.endTime, schedule.closingTime) > 0
        ) {
            throw new InvalidOperationError(
                "La reserva debe estar dentro del horario de atención del escenario.",
                "BOOKING_OUTSIDE_SCHEDULE"
            );
        }

        const [blocks, recurringBlocks, bookings] = await Promise.all([
            this.venueRepository.findBlocksForDate(booking.venueId, input.date),
            this.venueRepository.findRecurringBlocksByDay(booking.venueId, input.date.dayOfWeek),
            this.bookingRepository.findForVenueOnDate(booking.venueId, input.date),
        ]);

        const occupiedIntervals: Interval[] = [
            ...blocks,
            ...recurringBlocks,
            ...bookings.filter((item) => item.id !== booking.id),
        ];

        const hasCollision = occupiedIntervals.some((interval) =>
            Temporal.PlainTime.compare(input.startTime, interval.endTime) < 0 &&
            Temporal.PlainTime.compare(interval.startTime, input.endTime) < 0
        );

        if (hasCollision) {
            throw new ConflictError(
                "La reserva se superpone con otra reserva, bloqueo o bloqueo recurrente existente.",
                "BOOKING_COLLISION"
            );
        }

        const updatedBooking = await this.bookingRepository.updateSchedule(
            input.bookingId,
            input.date,
            input.startTime,
            input.endTime
        );

        return BookingViewMapper.toView(updatedBooking);
    }
}
