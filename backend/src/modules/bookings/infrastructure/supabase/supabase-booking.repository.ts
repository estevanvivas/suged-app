import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {Temporal} from "@js-temporal/polyfill";
import {Booking} from "@bookings-module/domain/entities/booking.entity";
import {supabaseClient} from "@infra/database/supabase/client";
import {BookingMapper} from "@bookings-module/infrastructure/supabase/booking.mapper";
import {DatabaseQueryError} from "@shared/errors/DatabaseError";

const BOOKING_COLS = "id, usuario_id, escenario_id, fecha_reserva, hora_inicio, hora_fin, estado, qr_token, creado_en";
const ACTIVE_BOOKING_STATUSES = ["PENDIENTE_APROBACION", "APROBADA"];

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
}
