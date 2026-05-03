import {Temporal} from "@js-temporal/polyfill";
import {Booking, BookingStatus} from "@bookings-module/domain/entities/booking.entity";
import {BookingRow} from "@bookings-module/infrastructure/supabase/booking-row.type";

export class BookingMapper {
    static toDomain(row: BookingRow): Booking {
        return new Booking(
            row.id,
            row.usuario_id,
            row.escenario_id,
            Temporal.PlainDate.from(row.fecha_reserva),
            Temporal.PlainTime.from(row.hora_inicio),
            Temporal.PlainTime.from(row.hora_fin),
            row.estado as BookingStatus,
            row.qr_token,
            Temporal.Instant.from(row.creado_en)
        );
    }

    static toPersistence(booking: Booking): Omit<BookingRow, "id"> {
        return {
            usuario_id: booking.userId,
            escenario_id: booking.venueId,
            fecha_reserva: booking.bookingDate.toString(),
            hora_inicio: booking.startTime.toString(),
            hora_fin: booking.endTime.toString(),
            estado: booking.status,
            qr_token: booking.qrToken,
            creado_en: booking.createdAt.toString(),
        };
    }
}
