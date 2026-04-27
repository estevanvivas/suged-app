import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class DeleteVenueUseCase {
    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(venueId: string): Promise<void> {
        const existingVenue = await this.venueRepository.findById(venueId);
        if (!existingVenue) {
            throw new NotFoundError("No se encontró el escenario", "VENUE_NOT_FOUND");
        }

        await this.venueRepository.delete(venueId);
    }
}