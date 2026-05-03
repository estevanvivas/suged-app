import {BookingStatus} from "@bookings-module/domain/entities/booking.entity";

export interface BookingView {
    id: string;
    userId: string;
    venueId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    qrToken: string;
    createdAt: string;
}
