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

    static toPersistence(block: Booking): Omit<BookingRow, "id"> {
        return {
            usuario_id: block.userId,
            escenario_id: block.venueId,
            fecha_reserva: block.bookingDate.toString(),
            hora_inicio: block.startTime.toString(),
            hora_fin: block.endTime.toString(),
            estado: block.status,
            qr_token: block.qrToken,
            creado_en: block.createdAt.toString(),
        };
    }
}