import {Venue} from "@venues-module/domain/entities/venue.entity";
import {Schedule} from "@venues-module/domain/entities/schedule.entity";
import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {Block} from "@venues-module/domain/entities/block.entity";


export interface VenueRepository {
    create(venue: Venue): Promise<Venue | null>;

    findAll(): Promise<Venue[]>;

    findById(id: string): Promise<Venue | null>;

    getScheduleByDay(
        venueId: string,
        dayOfWeek: DayOfWeek
    ): Promise<Schedule | null>;

    findBlocksForDate(
        venueId: string,
        date: string
    ): Promise<Block[]>;
}