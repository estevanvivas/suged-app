import {RecurringBlockIdInput} from "@venues-module/application/contracts/recurring-block-id.input";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {ForbiddenError} from "@shared/errors/ForbiddenError";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class DeleteRecurringBlockUseCase {
    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(input: RecurringBlockIdInput): Promise<void> {
        const block = await this.venueRepository.findRecurringBlockById(input.blockId);
        if (!block) {
            throw new NotFoundError("No se encontró el bloqueo recurrente", "RECURRING_BLOCK_NOT_FOUND");
        }

        if (block.venueId !== input.venueId) {
            throw new ForbiddenError("El bloqueo recurrente no pertenece a este escenario.");
        }

        await this.venueRepository.deleteRecurringBlock(input.venueId, input.blockId);
    }
}
