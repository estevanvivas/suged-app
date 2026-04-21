import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {UpsertVenueScheduleInput} from "@venues-module/application/contracts/upsert-venue-schedule.input";
import {ConflictError} from "@shared/errors/ConflictError";
import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {Temporal} from "@js-temporal/polyfill";
import {Schedule} from "@venues-module/domain/entities/schedule.entity";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class UpsertVenueScheduleUseCase {
    constructor(
        private readonly venueRepository: VenueRepository,
        private readonly bookingRepository: BookingRepository
    ) {
    }

    async execute(input: UpsertVenueScheduleInput): Promise<void> {
        const venue = await this.venueRepository.findById(input.venueId);
        if (!venue) {
            throw new NotFoundError("No se encontró el escenario", "VENUE_NOT_FOUND");
        }

        const today = Temporal.Now.plainDateISO();

        const collisions = await this.bookingRepository.findForVenueOnDate(input.venueId, today);

        const affected = collisions.filter((booking) => {
            const bookingDay = booking.bookingDate.dayOfWeek;
            if (bookingDay !== input.dayOfWeek) return false;

            const startsBeforeOpening = booking.startTime < input.openingTime;
            const endsAfterClosing = booking.endTime > input.closingTime;

            return startsBeforeOpening || endsAfterClosing;
        });

        if (affected.length > 0) {
            throw new ConflictError(
                `Accion denegada: modificar este horario dejaria ${affected.length} reserva(s) por fuera del horario de atencion. Cancela esas reservas antes de aplicar el cambio.`,
                "VENUE_SCHEDULE_CONFLICT"
            );
        }

        await this.venueRepository.upsertSchedule(Schedule.create({
            venueId: input.venueId,
            dayOfWeek: input.dayOfWeek,
            openingTime: input.openingTime,
            closingTime: input.closingTime,
        }));
    }
}