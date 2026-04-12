export interface ScheduleRow {
    id: string;
    escenario_id: string;
    dia_semana: number;  // DayOfWeek enum
    hora_apertura: string; // "HH:MM:SS" → Temporal.PlainTime
    hora_cierre: string;
}