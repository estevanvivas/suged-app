import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";
import {UpdateVenueInput} from "@venues-module/application/contracts/update-venue.input";
import {VenueViewMapper} from "@venues-module/application/mappers/venue-view.mapper";
import {VenueView} from "@venues-module/application/contracts/venue.view";
import {Venue} from "@venues-module/domain/entities/venue.entity";

export class UpdateVenueUseCase {

    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(input: UpdateVenueInput): Promise<VenueView> {
        const existingVenue = await this.venueRepository.findById(input.id);
        if (!existingVenue) {
            throw new NotFoundError("No se encontró el escenario", "VENUE_NOT_FOUND");
        }

        const venueToUpdate = new Venue(
            existingVenue.id,
            input.name ?? existingVenue.name,
            input.description ?? existingVenue.description,
            input.capacity ?? existingVenue.capacity,
            existingVenue.imageUrl,
            existingVenue.status,
            existingVenue.createdAt
        );

        const updatedVenue = await this.venueRepository.update(venueToUpdate);

        return VenueViewMapper.toView(updatedVenue);
    }
}