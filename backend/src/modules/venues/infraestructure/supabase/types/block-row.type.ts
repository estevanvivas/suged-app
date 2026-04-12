export interface BlockRow {
    id: string;
    escenario_id: string;
    fecha: string;       // "YYYY-MM-DD" → Temporal.PlainDate
    hora_inicio: string; // "HH:MM:SS"   → Temporal.PlainTime
    hora_fin: string;
    motivo: string | null;
}