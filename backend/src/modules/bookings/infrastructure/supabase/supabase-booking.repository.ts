import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {Temporal} from "@js-temporal/polyfill";
import {Booking, BookingStatus} from "@bookings-module/domain/entities/booking.entity";
import {supabaseClient} from "@infra/database/supabase/client";
import {BookingMapper} from "@bookings-module/infrastructure/supabase/booking.mapper";
import {DatabaseQueryError} from "@shared/errors/DatabaseError";

const BOOKING_COLS = "id, usuario_id, escenario_id, fecha_reserva, hora_inicio, hora_fin, estado, qr_token, creado_en";
const ACTIVE_BOOKING_STATUSES = ["APROBACION_PENDIENTE", "APROBADA"];

export class SupabaseBookingRepository implements BookingRepository {
    async findForVenueOnDate(venueId: string, date: Temporal.PlainDate): Promise<Booking[]> {
        const {data, error} = await supabaseClient
            .from("reservas")
            .select(BOOKING_COLS)
            .eq("escenario_id", venueId)
            .eq("fecha_reserva", date.toString())
            .in("estado", ACTIVE_BOOKING_STATUSES);

        if (error) throw new DatabaseQueryError();
        return data.map(BookingMapper.toDomain);
    }

    async findById(id: string): Promise<Booking | null> {
        const {data, error} = await supabaseClient
            .from("reservas")
            .select(BOOKING_COLS)
            .eq("id", id)
            .maybeSingle();

        if (error) throw new DatabaseQueryError();
        return data ? BookingMapper.toDomain(data) : null;
    }

    async findByUserId(userId: string): Promise<Booking[]> {
        const {data, error} = await supabaseClient
            .from("reservas")
            .select(BOOKING_COLS)
            .eq("usuario_id", userId)
            .order("fecha_reserva", {ascending: false})
            .order("hora_inicio", {ascending: false});

        if (error) throw new DatabaseQueryError();
        return data.map(BookingMapper.toDomain);
    }

    async save(booking: Booking): Promise<Booking> {
        const {data, error} = await supabaseClient
            .from("reservas")
            .insert({
                id: booking.id,
                ...BookingMapper.toPersistence(booking)
            })
            .select(BOOKING_COLS)
            .single();

        if (error) throw new DatabaseQueryError();
        return BookingMapper.toDomain(data);
    }

    async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
        const {data, error} = await supabaseClient
            .from("reservas")
            .update({estado: status})
            .eq("id", id)
            .select(BOOKING_COLS)
            .single();

        if (error) throw new DatabaseQueryError();
        return BookingMapper.toDomain(data);
    }

    async updateSchedule(
        id: string,
        date: Temporal.PlainDate,
        startTime: Temporal.PlainTime,
        endTime: Temporal.PlainTime
    ): Promise<Booking> {
        const {data, error} = await supabaseClient
            .from("reservas")
            .update({
                fecha_reserva: date.toString(),
                hora_inicio: startTime.toString(),
                hora_fin: endTime.toString(),
            })
            .eq("id", id)
            .select(BOOKING_COLS)
            .single();

        if (error) throw new DatabaseQueryError();
        return BookingMapper.toDomain(data);
    }

    async delete(id: string): Promise<void> {
        const {error} = await supabaseClient
            .from("reservas")
            .delete()
            .eq("id", id);

        if (error) throw new DatabaseQueryError();
    }
}
