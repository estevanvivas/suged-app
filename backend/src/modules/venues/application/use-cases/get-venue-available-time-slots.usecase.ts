import {
    GetVenueAvailableTimeSlotsInput
} from "@venues-module/application/contracts/get-venue-available-time-slots.input";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {VenueAvailabilityService} from "@venues-module/application/services/venue-availability.service";

export class GetVenueAvailableTimeSlotsUseCase {
    constructor(
        private readonly venueAvailabilityService: VenueAvailabilityService
    ) {
    }

    async execute(input: GetVenueAvailableTimeSlotsInput): Promise<TimeSlotView[]> {
        return this.venueAvailabilityService.getAvailableTimeSlots(input.venueId, input.date);
    }
}