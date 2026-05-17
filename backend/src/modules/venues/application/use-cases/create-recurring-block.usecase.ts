import {Temporal} from "@js-temporal/polyfill";

import {CreateRecurringBlockInput} from "@venues-module/application/contracts/create-recurring-block.input";
import {RecurringBlockView} from "@venues-module/application/contracts/recurring-block.view";
import {RecurringBlockViewMapper} from "@venues-module/application/mappers/recurring-block-view.mapper";
import {RecurringBlock} from "@venues-module/domain/entities/recurring-block.entity";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {ConflictError} from "@shared/errors/ConflictError";
import {NotFoundError} from "@shared/errors/NotFoundError";

export class CreateRecurringBlockUseCase {
    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(input: CreateRecurringBlockInput): Promise<RecurringBlockView> {
        const venue = await this.venueRepository.findById(input.venueId);
        if (!venue) {
            throw new NotFoundError("No se encontro el escenario", "VENUE_NOT_FOUND");
        }

        const existingBlocks = await this.venueRepository.findRecurringBlocksByDay(input.venueId, input.dayOfWeek);
        const hasCollision = existingBlocks.some((block) =>
            Temporal.PlainTime.compare(input.startTime, block.endTime) < 0 &&
            Temporal.PlainTime.compare(block.startTime, input.endTime) < 0
        );

        if (hasCollision) {
            throw new ConflictError(
                "El bloqueo recurrente se superpone con otro bloqueo recurrente existente.",
                "RECURRING_BLOCK_COLLISION"
            );
        }

        const block = RecurringBlock.create({
            venueId: input.venueId,
            dayOfWeek: input.dayOfWeek,
            startTime: input.startTime,
            endTime: input.endTime,
            reason: input.reason || null,
        });

        const savedBlock = await this.venueRepository.saveRecurringBlock(block);
        return RecurringBlockViewMapper.toView(savedBlock);
    }
}
