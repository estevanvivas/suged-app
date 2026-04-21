import {Venue} from "@venues-module/domain/entities/venue.entity";
import {Schedule} from "@venues-module/domain/entities/schedule.entity";
import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {Block} from "@venues-module/domain/entities/block.entity";
import {RecurringBlock} from "@venues-module/domain/entities/recurring-block.entity";
import {Temporal} from "@js-temporal/polyfill";


export interface VenueRepository {
    save(venue: Venue): Promise<Venue>;

    findAll(): Promise<Venue[]>;

    findActives(): Promise<Venue[]>;

    findById(id: string): Promise<Venue | null>;

    getScheduleByDay(
        venueId: string,
        dayOfWeek: DayOfWeek
    ): Promise<Schedule | null>;

    findBlocksForDate(
        venueId: string,
        date: Temporal.PlainDate
    ): Promise<Block[]>;

    findRecurringBlocksByDay(
        venueId: string,
        dayOfWeek: DayOfWeek
    ): Promise<RecurringBlock[]>;

    upsertSchedule(schedule: Schedule): Promise<Schedule>;

    saveVenueBlock(block: Block): Promise<Block>;

    deleteVenueBlock(id: string): Promise<void>;

    findVenueBlockById(blockId: string): Promise<Block | null>
}