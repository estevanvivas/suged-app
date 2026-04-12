import {DateTime} from "luxon";
import {UUID} from "@/core/domain/value-objects/uuid";

export class Venue {

    private constructor(
        public readonly id: UUID,
        public name: string,
        public description: string,
        public capacity: number,
        public imageUrl: string | null,
        public status: VenueStatus,
        public createdAt: DateTime,
    ) {
    }

    static create(venueData: {
        name: string;
        description: string;
        capacity: number;
        imageUrl?: string | null;
    }): Venue {
        return new Venue(
            UUID.generate(),
            venueData.name,
            venueData.description,
            venueData.capacity,
            venueData.imageUrl ?? null,
            'ACTIVE',
            DateTime.now(),
        );
    }
}

export type VenueStatus =
    | 'ACTIVE'
    | 'INACTIVE';