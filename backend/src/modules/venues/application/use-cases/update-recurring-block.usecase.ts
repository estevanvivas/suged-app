import {Temporal} from "@js-temporal/polyfill";

import {UpdateRecurringBlockInput} from "@venues-module/application/contracts/update-recurring-block.input";
import {RecurringBlockView} from "@venues-module/application/contracts/recurring-block.view";
import {RecurringBlockViewMapper} from "@venues-module/application/mappers/recurring-block-view.mapper";
import {RecurringBlock} from "@venues-module/domain/entities/recurring-block.entity";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {ConflictError} from "@shared/errors/ConflictError";
import {ForbiddenError} from "@shared/errors/ForbiddenError";
import {InvalidOperationError} from "@shared/errors/InvalidOperationError";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class UpdateRecurringBlockUseCase {
    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(input: UpdateRecurringBlockInput): Promise<RecurringBlockView> {
        const existingBlock = await this.venueRepository.findRecurringBlockById(input.blockId);
        if (!existingBlock) {
            throw new NotFoundError("No se encontró el bloqueo recurrente", "RECURRING_BLOCK_NOT_FOUND");
        }

        if (existingBlock.venueId !== input.venueId) {
            throw new ForbiddenError("El bloqueo recurrente no pertenece a este escenario.");
        }

        const dayOfWeek = input.dayOfWeek ?? existingBlock.dayOfWeek;
        const startTime = input.startTime ?? existingBlock.startTime;
        const endTime = input.endTime ?? existingBlock.endTime;
        const reason = input.reason === undefined ? existingBlock.reason : input.reason || null;

        if (Temporal.PlainTime.compare(startTime, endTime) >= 0) {
            throw new InvalidOperationError(
                "La hora de inicio del bloqueo debe ser anterior a la hora de finalizacion.",
                "RECURRING_BLOCK_INVALID_TIME_RANGE"
            );
        }

        const sameDayBlocks = await this.venueRepository.findRecurringBlocksByDay(input.venueId, dayOfWeek);
        const hasCollision = sameDayBlocks
            .filter((block) => block.id !== input.blockId)
            .some((block) =>
                Temporal.PlainTime.compare(startTime, block.endTime) < 0 &&
                Temporal.PlainTime.compare(block.startTime, endTime) < 0
            );

        if (hasCollision) {
            throw new ConflictError(
                "El bloqueo recurrente se superpone con otro bloqueo recurrente existente.",
                "RECURRING_BLOCK_COLLISION"
            );
        }

        const blockToUpdate = new RecurringBlock(
            existingBlock.id,
            existingBlock.venueId,
            dayOfWeek,
            startTime,
            endTime,
            reason,
            existingBlock.createdAt
        );

        const updatedBlock = await this.venueRepository.updateRecurringBlock(blockToUpdate);
        return RecurringBlockViewMapper.toView(updatedBlock);
    }
}
