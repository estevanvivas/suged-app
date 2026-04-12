import {Temporal} from "@js-temporal/polyfill";

export class Venue {

    private constructor(
        public readonly id: string,
        public name: string,
        public description: string,
        public capacity: number,
        public imageUrl: string | null,
        public status: VenueStatus,
        public createdAt: Temporal.Instant,
    ) {
    }

    static create(venueData: {
        name: string;
        description: string;
        capacity: number;
        imageUrl?: string | null;
    }): Venue {
        return new Venue(
            crypto.randomUUID().toString(),
            venueData.name,
            venueData.description,
            venueData.capacity,
            venueData.imageUrl ?? null,
            'ACTIVE',
            Temporal.Now.instant()
        );
    }
}

export type VenueStatus =
    | 'ACTIVE'
    | 'INACTIVE';