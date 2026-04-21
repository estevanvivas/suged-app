import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class DeleteVenueBlockUseCase {
    constructor(
        private readonly venueRepository: VenueRepository
    ) {
    }

    async execute(blockId: string): Promise<void> {
        const block = await this.venueRepository.findVenueBlockById(blockId);
        if (!block) {
            throw new NotFoundError("No se encontró el bloqueo", "BLOCK_NOT_FOUND");
        }

        await this.venueRepository.deleteVenueBlock(blockId);
    }
}