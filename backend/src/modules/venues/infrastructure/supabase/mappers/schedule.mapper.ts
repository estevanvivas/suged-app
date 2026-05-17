import { Temporal } from "@js-temporal/polyfill";
import { Schedule } from "@venues-module/domain/entities/schedule.entity";
import { DayOfWeek } from "@/core/domain/enums/day-of-week";
import { ScheduleRow } from "../types/schedule-row.type";

export class ScheduleMapper {
    static toDomain(row: ScheduleRow): Schedule {
        return new Schedule(
            row.id,
            row.escenario_id,
            row.dia_semana as DayOfWeek,
            Temporal.PlainTime.from(row.hora_apertura),
            Temporal.PlainTime.from(row.hora_cierre),
        );
    }

    static toPersistence(schedule: Schedule): Omit<ScheduleRow, "id"> {
        return {
            escenario_id: schedule.venueId,
            dia_semana: schedule.dayOfWeek,
            hora_apertura: schedule.openingTime.toString(),
            hora_cierre: schedule.closingTime.toString(),
        };
    }
}