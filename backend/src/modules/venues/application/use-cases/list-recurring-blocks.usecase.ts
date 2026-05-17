import {RecurringBlockView} from "@venues-module/application/contracts/recurring-block.view";
import {RecurringBlockViewMapper} from "@venues-module/application/mappers/recurring-block-view.mapper";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class ListRecurringBlocksUseCase {
    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(venueId: string): Promise<RecurringBlockView[]> {
        const venue = await this.venueRepository.findById(venueId);
        if (!venue) {
            throw new NotFoundError("No se encontró el escenario", "VENUE_NOT_FOUND");
        }

        const blocks = await this.venueRepository.findRecurringBlocksByVenue(venueId);
        return blocks.map(RecurringBlockViewMapper.toView);
    }
}
