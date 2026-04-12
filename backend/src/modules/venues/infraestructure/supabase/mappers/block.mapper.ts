import { Temporal } from "@js-temporal/polyfill";
import { Block } from "@venues-module/domain/entities/block.entity";
import { BlockRow } from "../types/block-row.type";

export class BlockMapper {
    static toDomain(row: BlockRow): Block {
        return new Block(
            row.id,
            row.escenario_id,
            Temporal.PlainDate.from(row.fecha),
            Temporal.PlainTime.from(row.hora_inicio),
            Temporal.PlainTime.from(row.hora_fin),
            row.motivo,
        );
    }

    static toPersistence(block: Block): Omit<BlockRow, "id"> {
        return {
            escenario_id: block.venueId,
            fecha: block.date.toString(),         // → "YYYY-MM-DD"
            hora_inicio: block.startTime.toString(), // → "HH:MM:SS"
            hora_fin: block.endTime.toString(),
            motivo: block.reason,
        };
    }
}