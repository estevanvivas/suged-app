import { Temporal } from "@js-temporal/polyfill";
import { RecurringBlock } from "@venues-module/domain/entities/recurring-block.entity";
import { DayOfWeek } from "@/core/domain/enums/day-of-week";
import { RecurringBlockRow } from "../types/recurring-block-row.type";

export class RecurringBlockMapper {
    static toDomain(row: RecurringBlockRow): RecurringBlock {
        return new RecurringBlock(
            row.id,
            row.escenario_id,
            row.dia_semana as DayOfWeek,
            Temporal.PlainTime.from(row.hora_inicio),
            Temporal.PlainTime.from(row.hora_fin),
            row.motivo,
            Temporal.Instant.from(row.creado_en),
        );
    }

    static toPersistence(block: RecurringBlock): Omit<RecurringBlockRow, "id"> {
        return {
            escenario_id: block.venueId,
            dia_semana: block.dayOfWeek,
            hora_inicio: block.startTime.toString(),
            hora_fin: block.endTime.toString(),
            motivo: block.reason,
            creado_en: block.createdAt.toString(),
        };
    }
}