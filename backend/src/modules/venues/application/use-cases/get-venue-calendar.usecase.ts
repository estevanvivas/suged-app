import {Temporal} from "@js-temporal/polyfill";

import {GetVenueCalendarInput} from "@venues-module/application/contracts/get-venue-calendar.input";
import {VenueCalendarDayView} from "@venues-module/application/contracts/venue-calendar-day.view";
import {GetVenueAvailableTimeSlotsUseCase} from "@venues-module/application/use-cases/get-venue-available-time-slots.usecase";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class GetVenueCalendarUseCase {
    constructor(
        private readonly venueRepository: VenueRepository,
        private readonly getVenueAvailableTimeSlotsUseCase: GetVenueAvailableTimeSlotsUseCase
    ) {
    }

    async execute(input: GetVenueCalendarInput): Promise<VenueCalendarDayView[]> {
        const venue = await this.venueRepository.findById(input.venueId);
        if (!venue) {
            throw new NotFoundError("No se encontró el escenario", "VENUE_NOT_FOUND");
        }

        const days: Temporal.PlainDate[] = [];
        let current = input.from;

        while (Temporal.PlainDate.compare(current, input.to) <= 0) {
            days.push(current);
            current = current.add({days: 1});
        }

        return Promise.all(days.map(async (date) => {
            const schedule = await this.venueRepository.getScheduleByDay(input.venueId, date.dayOfWeek);
            const slots = schedule
                ? await this.getVenueAvailableTimeSlotsUseCase.execute({
                    venueId: input.venueId,
                    date,
                })
                : [];

            return {
                date: date.toString(),
                dayOfWeek: date.dayOfWeek,
                isOpen: Boolean(schedule),
                slots,
            };
        }));
    }
}
