import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {CreateVenueBlockInput} from "@venues-module/application/contracts/create-venue-block.input";
import {NotFoundError} from "@shared/errors/NotFoundError";
import {ConflictError} from "@shared/errors/ConflictError";
import {Block} from "@venues-module/domain/entities/block.entity";

export class CreateVenueBlockUseCase {
    constructor(private readonly venueRepository: VenueRepository) {
    }

    async execute(input: CreateVenueBlockInput): Promise<void> {
        const venue = await this.venueRepository.findById(input.venueId);
        if (!venue) {
            throw new NotFoundError("No se encontró el escenario", "VENUE_NOT_FOUND");
        }

        const {venueId, date, startTime, endTime, reason} = input;

        const existingBlocks = await this.venueRepository.findBlocksForDate(venueId, date);
        const recurringBlocks = await this.venueRepository.findRecurringBlocksByDay(
            venueId,
            date.dayOfWeek
        );

        const hasCollision = [...existingBlocks, ...recurringBlocks].some(
            (item) => startTime < item.endTime && item.startTime < endTime
        );

        if (hasCollision) {
            throw new ConflictError(
                "El bloque se superpone con otro bloque existente o con un bloqueo recurrente.",
                "VENUE_BLOCK_COLLISION"
            );
        }

        const newBlock = Block.create({
            venueId,
            date,
            startTime,
            endTime,
            reason: reason || null
        });

        await this.venueRepository.saveBlock(newBlock);
    }
}