import type {Request, Response} from "express";

import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {CreateBookingUseCase} from "@bookings-module/application/use-cases/create-booking.usecase";
import {CreateBookingBody} from "@bookings-module/interfaces/http/validation/create-booking.schema";
import {UnauthorizedError} from "@shared/errors/UnauthorizedError";

export class BookingController {
    constructor(private readonly createBookingUseCase: CreateBookingUseCase) {
    }

    createBooking = async (
        req: Request<Record<string, never>, BookingView, CreateBookingBody>,
        res: Response<BookingView>
    ) => {
        if (!req.user) {
            throw new UnauthorizedError("Usuario no autenticado.");
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
}
