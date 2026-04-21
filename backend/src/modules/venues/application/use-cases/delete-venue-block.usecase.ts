import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {NotFoundError} from "@shared/errors/NotFoundError";
import {DeleteVenueBlockInput} from "@venues-module/application/contracts/delete-venue-block.input";
import {ForbiddenError} from "@shared/errors/ForbiddenError";

export class DeleteVenueBlockUseCase {
    constructor(
        private readonly venueRepository: VenueRepository
    ) {
    }

    async execute(input: DeleteVenueBlockInput): Promise<void> {
        const block = await this.venueRepository.findVenueBlockById(input.blockId);
        if (!block) {
            throw new NotFoundError("No se encontró el bloqueo", "BLOCK_NOT_FOUND");
        }

        if (block.venueId !== input.venueId) {
            throw new ForbiddenError("El bloqueo no pertenece a este escenario");
        }

        await this.venueRepository.deleteVenueBlock(input.venueId, input.blockId);
    }
}