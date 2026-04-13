import {BookingRepository} from "@bookings-module/domain/repositories/booking.repository";
import {Temporal} from "@js-temporal/polyfill";
import {Booking} from "@bookings-module/domain/entities/booking.entity";
import {supabaseClient} from "@infra/database/supabase/client";
import {BookingMapper} from "@bookings-module/infrastructure/supabase/booking.mapper";

const BOOKING_COLS = "id, usuario_id, escenario_id, fecha_reserva, hora_inicio, hora_fin, estado, qr_token, creado_en";

export class SupabaseBookingRepository implements BookingRepository {
    async findForVenueOnDate(venueId: string, date: Temporal.PlainDate): Promise<Booking[]> {
        const {data} = await supabaseClient
            .from("reservations")
            .select(BOOKING_COLS)
            .eq("venue_id", venueId)
            .eq("reservation_date", date.toString())
            .in("status", ["PENDING_APPROVAL", "APPROVED"]);

        return (data ?? []).map(BookingMapper.toDomain)
    }
}