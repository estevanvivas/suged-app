export interface RecurringBlockRow {
    id: string;
    escenario_id: string;
    dia_semana: number;
    hora_inicio: string;
    hora_fin: string;
    motivo: string | null;
    creado_en: string; // ISO 8601 → Temporal.Instant
}