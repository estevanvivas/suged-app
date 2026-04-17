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
import {DatabaseQueryError} from "@shared/errors/DatabaseError";

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
            .eq("estado", "ACTIVE");

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

    async save(venue: Venue): Promise<Venue | null> {
        const {data, error} = await supabaseClient
            .from("escenarios")
            .insert({id: venue.id, ...VenueMapper.toPersistence(venue)})
            .select(VENUE_COLS)
            .single();

        if (error) throw new DatabaseQueryError();
        return VenueMapper.toDomain(data);
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

    async findBlocksForDate(venueId: string, date: string): Promise<Block[]> {
        const {data, error} = await supabaseClient
            .from("bloqueos_escenarios")
            .select(BLOCK_COLS)
            .eq("escenario_id", venueId)
            .eq("fecha", date);

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
}