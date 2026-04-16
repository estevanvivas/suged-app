import {Venue} from "@venues-module/domain/entities/venue.entity";
import {Schedule} from "@venues-module/domain/entities/schedule.entity";
import {Block} from "@venues-module/domain/entities/block.entity";
import {RecurringBlock} from "@venues-module/domain/entities/recurring-block.entity";
import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {VenueRepository} from "@venues-module/domain/repositories/venue.repository";
import {supabaseClient} from "@infra/database/supabase/client";
import {VenueMapper} from "@venues-module/infraestructure/supabase/mappers/venue.mapper";
import {ScheduleMapper} from "@venues-module/infraestructure/supabase/mappers/schedule.mapper";
import {BlockMapper} from "@venues-module/infraestructure/supabase/mappers/block.mapper";
import {RecurringBlockMapper} from "@venues-module/infraestructure/supabase/mappers/recurring-block.mapper";

const VENUE_COLS = "id, nombre, descripcion, aforo, imagen_url, estado, creado_en";
const SCHEDULE_COLS = "id, escenario_id, dia_semana, hora_apertura, hora_cierre";
const BLOCK_COLS = "id, escenario_id, fecha, hora_inicio, hora_fin, motivo";
const RECURRING_BLOCK_COLS = "id, escenario_id, dia_semana, hora_inicio, hora_fin, motivo, creado_en";

export class SupabaseVenueRepository implements VenueRepository {

    async findAll(): Promise<Venue[]> {
        const {data} = await supabaseClient
            .from("escenarios")
            .select(VENUE_COLS);

        return (data ?? []).map(VenueMapper.toDomain);
    }

    async findActives(): Promise<Venue[]> {
        const {data} = await supabaseClient
            .from("escenarios")
            .select(VENUE_COLS)
            .eq("estado", "ACTIVE");

        return (data ?? []).map(VenueMapper.toDomain);
    }

    async findById(id: string): Promise<Venue | null> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .select(VENUE_COLS)
            .eq("id", id)
            .single();

        return error ? null : VenueMapper.toDomain(data);
    }

    async create(venue: Venue): Promise<Venue | null> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .insert({id: venue.id, ...VenueMapper.toPersistence(venue)})
            .select(VENUE_COLS)
            .single();

        return error ? null : VenueMapper.toDomain(data);
    }

    async getScheduleByDay(venueId: string, day: DayOfWeek): Promise<Schedule | null> {
        const {data, error} = await supabaseClient
            .from("horarios_escenarios")
            .select(SCHEDULE_COLS)
            .eq("escenario_id", venueId)
            .eq("dia_semana", day)
            .single();

        return error ? null : ScheduleMapper.toDomain(data);
    }

    async findBlocksForDate(venueId: string, date: string): Promise<Block[]> {
        const {data} = await supabaseClient
            .from("bloqueos_escenarios")
            .select(BLOCK_COLS)
            .eq("escenario_id", venueId)
            .eq("fecha", date);

        return (data ?? []).map(BlockMapper.toDomain);
    }

    async findRecurringBlocksByDay(venueId: string, dayOfWeek: DayOfWeek): Promise<RecurringBlock[]> {
        const {data} = await supabaseClient
            .from("bloqueos_recurrentes_escenarios")
            .select(RECURRING_BLOCK_COLS)
            .eq("escenario_id", venueId)
            .eq("dia_semana", dayOfWeek);

        return (data ?? []).map(RecurringBlockMapper.toDomain);
    }
}