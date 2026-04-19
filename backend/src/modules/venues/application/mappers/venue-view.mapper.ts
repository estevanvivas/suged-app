import {Venue} from "@venues-module/domain/entities/venue.entity";
import {VenueView} from "@venues-module/application/contracts/venue.view";

export class VenueViewMapper {
    static toView(venue: Venue): VenueView {
        return {
            name: venue.name,
            description: venue.description,
            capacity: venue.capacity,
            imageUrl: venue.imageUrl ?? undefined,
        };
    }
}