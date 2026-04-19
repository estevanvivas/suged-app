import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {Venue} from "@venues-module/domain/entities/venue.entity";
import {CreateVenueInput} from "@venues-module/application/contracts/create-venue.input";
import {VenueView} from "@venues-module/application/contracts/venue.view";
import {VenueViewMapper} from "@venues-module/application/mappers/venue-view.mapper";

export class CreateVenueUseCase {
    constructor(
        private readonly venueRepository: VenueRepository
    ) {
    }

    async execute(input: CreateVenueInput): Promise<VenueView> {
        const venue = Venue.create({
            name: input.name,
            description: input.description,
            capacity: input.capacity,
        });

        const createdVenue = await this.venueRepository.save(venue);

        return VenueViewMapper.toView(createdVenue);
    }
}