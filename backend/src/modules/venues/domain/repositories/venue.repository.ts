import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {Block} from "@venues-module/domain/entities/block.entity";
import {RecurringBlock} from "@venues-module/domain/entities/recurring-block.entity";
import {Schedule} from "@venues-module/domain/entities/schedule.entity";
import {Venue} from "@venues-module/domain/entities/venue.entity";
import {Temporal} from "@js-temporal/polyfill";


export interface VenueRepository {
    findAll(): Promise<Venue[]>;

    findActives(): Promise<Venue[]>;

    findById(id: string): Promise<Venue | null>;

    save(venue: Venue): Promise<Venue>;

    update(venue: Venue): Promise<Venue>;

    delete(venueId: string): Promise<void>;

    getScheduleByDay(
        venueId: string,
        dayOfWeek: DayOfWeek
    ): Promise<Schedule | null>;

    upsertSchedule(schedule: Schedule): Promise<Schedule>;

    findBlocksForDate(
        venueId: string,
        date: Temporal.PlainDate
    ): Promise<Block[]>;

    findRecurringBlocksByDay(
        venueId: string,
        dayOfWeek: DayOfWeek
    ): Promise<RecurringBlock[]>;

    findVenueBlockById(blockId: string): Promise<Block | null>;

    saveVenueBlock(block: Block): Promise<Block>;

    deleteVenueBlock(venueId: string, blockId: string): Promise<void>;
}