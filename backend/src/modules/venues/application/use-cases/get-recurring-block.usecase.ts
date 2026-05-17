import {RecurringBlockIdInput} from "@venues-module/application/contracts/recurring-block-id.input";
import {RecurringBlockView} from "@venues-module/application/contracts/recurring-block.view";
import {RecurringBlockViewMapper} from "@venues-module/application/mappers/recurring-block-view.mapper";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {ForbiddenError} from "@shared/errors/ForbiddenError";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class GetRecurringBlockUseCase {
    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(input: RecurringBlockIdInput): Promise<RecurringBlockView> {
        const block = await this.venueRepository.findRecurringBlockById(input.blockId);
        if (!block) {
            throw new NotFoundError("No se encontró el bloqueo recurrente", "RECURRING_BLOCK_NOT_FOUND");
        }

        if (block.venueId !== input.venueId) {
            throw new ForbiddenError("El bloqueo recurrente no pertenece a este escenario.");
        }

        return RecurringBlockViewMapper.toView(block);
    }
}
