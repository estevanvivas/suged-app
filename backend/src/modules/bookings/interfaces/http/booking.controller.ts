import type {Request, Response} from "express";

import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {CreateBookingUseCase} from "@bookings-module/application/use-cases/create-booking.usecase";
import {UpdateBookingStatusUseCase} from "@bookings-module/application/use-cases/update-booking-status.usecase";
import {BookingIdParams} from "@bookings-module/interfaces/http/validation/booking-id-params.schema";
import {CreateBookingBody} from "@bookings-module/interfaces/http/validation/create-booking.schema";
import {UpdateBookingStatusBody} from "@bookings-module/interfaces/http/validation/update-booking-status.schema";
import {UnauthorizedError} from "@shared/errors/UnauthorizedError";

export class BookingController {
    constructor(
        private readonly createBookingUseCase: CreateBookingUseCase,
        private readonly updateBookingStatusUseCase: UpdateBookingStatusUseCase
    ) {
    }

    createBooking = async (
        req: Request<Record<string, never>, BookingView, CreateBookingBody>,
        res: Response<BookingView>
    ) => {
        if (!req.user) {
            throw new UnauthorizedError("Error de autenticación.");
        }

        const booking = await this.createBookingUseCase.execute({
            userId: req.user.id,
            venueId: req.body.venueId,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
        });

        return res.status(201).json(booking);
    };

    updateBookingStatus = async (
        req: Request<BookingIdParams, BookingView, UpdateBookingStatusBody>,
        res: Response<BookingView>
    ) => {
        const booking = await this.updateBookingStatusUseCase.execute({
            bookingId: req.params.bookingId,
            status: req.body.estado,
        });

        return res.status(200).json(booking);
    };
}
