export interface VenueRow {
    id: string;
    nombre: string;
    descripcion: string;
    aforo: number;
    imagen_url: string | null;
    estado: string;
    creado_en: string; // ISO 8601 → Temporal.Instant
}