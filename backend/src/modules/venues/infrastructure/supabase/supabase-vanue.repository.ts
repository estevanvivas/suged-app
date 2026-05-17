import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {supabaseClient} from "@infra/database/supabase/client";
import {Temporal} from "@js-temporal/polyfill";
import {DatabaseQueryError} from "@shared/errors/DatabaseError";
import {Block} from "@venues-module/domain/entities/block.entity";
import {RecurringBlock} from "@venues-module/domain/entities/recurring-block.entity";
import {Schedule} from "@venues-module/domain/entities/schedule.entity";
import {Venue} from "@venues-module/domain/entities/venue.entity";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {BlockMapper} from "../supabase/mappers/block.mapper";
import {RecurringBlockMapper} from "../supabase/mappers/recurring-block.mapper";
import {ScheduleMapper} from "../supabase/mappers/schedule.mapper";
import {VenueMapper} from "../supabase/mappers/venue.mapper";

const VENUE_COLS = "id, nombre, descripcion, aforo, imagen_url, estado, creado_en";
const SCHEDULE_COLS = "id, escenario_id, dia_semana, hora_apertura, hora_cierre";
const BLOCK_COLS = "id, escenario_id, fecha, hora_inicio, hora_fin, motivo";
const RECURRING_BLOCK_COLS = "id, escenario_id, dia_semana, hora_inicio, hora_fin, motivo, creado_en";

export class SupabaseVenueRepository implements VenueRepository {

    async findAll(): Promise<Venue[]> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .select(VENUE_COLS);

        if (error) throw new DatabaseQueryError();
        return data.map(VenueMapper.toDomain);
    }

    async findActives(): Promise<Venue[]> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .select(VENUE_COLS)
            .eq("estado", "ACTIVO");

        if (error) throw new DatabaseQueryError();
        return data.map(VenueMapper.toDomain);
    }

    async findById(id: string): Promise<Venue | null> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .select(VENUE_COLS)
            .eq("id", id)
            .maybeSingle();

        if (error) throw new DatabaseQueryError();
        return data ? VenueMapper.toDomain(data) : null;
    }

    async save(venue: Venue): Promise<Venue> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .insert({id: venue.id, ...VenueMapper.toPersistence(venue)})
            .select(VENUE_COLS)
            .single();

        if (error) throw new DatabaseQueryError();
        return VenueMapper.toDomain(data);
    }

    async update(venue: Venue): Promise<Venue> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .update(VenueMapper.toPersistence(venue))
            .eq("id", venue.id)
            .select(VENUE_COLS)
            .single();

        if (error) throw new DatabaseQueryError();
        return VenueMapper.toDomain(data);
    }

    async delete(venueId: string): Promise<void> {
        const {error} = await supabaseClient
            .from("escenarios")
            .delete()
            .eq("id", venueId);

        if (error) throw new DatabaseQueryError();
    }

    async getScheduleByDay(venueId: string, day: DayOfWeek): Promise<Schedule | null> {
        const {data, error} = await supabaseClient
            .from("horarios_escenarios")
            .select(SCHEDULE_COLS)
            .eq("escenario_id", venueId)
            .eq("dia_semana", day)
            .maybeSingle();

        if (error) throw new DatabaseQueryError();
        return data ? ScheduleMapper.toDomain(data) : null;
    }

    async findBlocksForDate(venueId: string, date: Temporal.PlainDate): Promise<Block[]> {
        const {data, error} = await supabaseClient
            .from("bloqueos_escenarios")
            .select(BLOCK_COLS)
            .eq("escenario_id", venueId)
            .eq("fecha", date.toString());

        if (error) throw new DatabaseQueryError();
        return data.map(BlockMapper.toDomain);
    }

    async findRecurringBlocksByDay(venueId: string, dayOfWeek: DayOfWeek): Promise<RecurringBlock[]> {
        const {data, error} = await supabaseClient
            .from("bloqueos_recurrentes")
            .select(RECURRING_BLOCK_COLS)
            .eq("escenario_id", venueId)
            .eq("dia_semana", dayOfWeek);

        if (error) throw new DatabaseQueryError();
        return data.map(RecurringBlockMapper.toDomain);
    }

    async upsertSchedule(schedule: Schedule): Promise<Schedule> {
        const existing = await this.getScheduleByDay(schedule.venueId, schedule.dayOfWeek);

        const base = ScheduleMapper.toPersistence(schedule);

        const payload = existing
            ? {...base, id: existing.id}
            : {...base, id: schedule.id};

        const {data, error} = await supabaseClient
            .from("horarios_escenarios")
            .upsert(payload, {
                onConflict: "escenario_id, dia_semana",
            })
            .select(SCHEDULE_COLS)
            .single();

        if (error) throw new DatabaseQueryError();

        return ScheduleMapper.toDomain(data);
    }

    async findVenueBlockById(blockId: string): Promise<Block | null> {
        const {data, error} = await supabaseClient
            .from("bloqueos_escenarios")
            .select(BLOCK_COLS)
            .eq("id", blockId)
            .maybeSingle();

        if (error) throw new DatabaseQueryError();
        return data ? BlockMapper.toDomain(data) : null;
    }

    async saveVenueBlock(block: Block): Promise<Block> {
        const {data, error} = await supabaseClient
            .from("bloqueos_escenarios")
            .insert({
                id: block.id,
                ...BlockMapper.toPersistence(block)
            })
            .select(BLOCK_COLS)
            .single();

        if (error) throw new DatabaseQueryError();
        return BlockMapper.toDomain(data);
    }

    async deleteVenueBlock(venueId: string, blockId: string): Promise<void> {
        const {error} = await supabaseClient
            .from("bloqueos_escenarios")
            .delete()
            .eq("id", blockId)
            .eq("escenario_id", venueId);

        if (error) throw new DatabaseQueryError();
    }
}