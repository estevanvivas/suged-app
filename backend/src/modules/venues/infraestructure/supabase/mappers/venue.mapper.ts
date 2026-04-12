import { Temporal } from "@js-temporal/polyfill";
import { Venue, VenueStatus } from "@venues-module/domain/entities/venue.entity";
import { VenueRow } from "../types/venue-row.type";

export class VenueMapper {
    static toDomain(row: VenueRow): Venue {
        return new Venue(
            row.id,
            row.nombre,
            row.descripcion,
            row.aforo,
            row.imagen_url,
            row.estado as VenueStatus,
            Temporal.Instant.from(row.creado_en),
        );
    }

    static toPersistence(venue: Venue): Omit<VenueRow, "id"> {
        return {
            nombre: venue.name,
            descripcion: venue.description,
            aforo: venue.capacity,
            imagen_url: venue.imageUrl,
            estado: venue.status,
            creado_en: venue.createdAt.toString(),
        };
    }
}