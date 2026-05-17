import type {Request, Response} from "express";

import {BookingView} from "@bookings-module/application/contracts/booking.view";
import {CancelBookingUseCase} from "@bookings-module/application/use-cases/cancel-booking.usecase";
import {CreateBookingUseCase} from "@bookings-module/application/use-cases/create-booking.usecase";
import {DeleteBookingUseCase} from "@bookings-module/application/use-cases/delete-booking.usecase";
import {GetBookingByIdUseCase} from "@bookings-module/application/use-cases/get-booking-by-id.usecase";
import {GetMyBookingsUseCase} from "@bookings-module/application/use-cases/get-my-bookings.usecase";
import {RescheduleBookingUseCase} from "@bookings-module/application/use-cases/reschedule-booking.usecase";
import {UpdateBookingStatusUseCase} from "@bookings-module/application/use-cases/update-booking-status.usecase";
import {BookingIdParams} from "@bookings-module/interfaces/http/validation/booking-id-params.schema";
import {CreateBookingBody} from "@bookings-module/interfaces/http/validation/create-booking.schema";
import {RescheduleBookingBody} from "@bookings-module/interfaces/http/validation/reschedule-booking.schema";
import {UpdateBookingStatusBody} from "@bookings-module/interfaces/http/validation/update-booking-status.schema";
import {UnauthorizedError} from "@shared/errors/UnauthorizedError";

export class BookingController {
    constructor(
        private readonly createBookingUseCase: CreateBookingUseCase,
        private readonly updateBookingStatusUseCase: UpdateBookingStatusUseCase,
        private readonly getMyBookingsUseCase: GetMyBookingsUseCase,
        private readonly getBookingByIdUseCase: GetBookingByIdUseCase,
        private readonly cancelBookingUseCase: CancelBookingUseCase,
        private readonly deleteBookingUseCase: DeleteBookingUseCase,
        private readonly rescheduleBookingUseCase: RescheduleBookingUseCase
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

    getMyBookings = async (
        req: Request<Record<string, never>, BookingView[]>,
        res: Response<BookingView[]>
    ) => {
        if (!req.user) {
            throw new UnauthorizedError("Error de autenticacion.");
        }

        const bookings = await this.getMyBookingsUseCase.execute({
            userId: req.user.id,
        });

        return res.status(200).json(bookings);
    };

    getBookingById = async (
        req: Request<BookingIdParams, BookingView>,
        res: Response<BookingView>
    ) => {
        if (!req.user) {
            throw new UnauthorizedError("Error de autenticacion.");
        }

        const booking = await this.getBookingByIdUseCase.execute({
            bookingId: req.params.bookingId,
            requesterId: req.user.id,
        });

        return res.status(200).json(booking);
    };

    updateBookingStatus = async (
        req: Request<BookingIdParams, BookingView, UpdateBookingStatusBody>,
        res: Response<BookingView>
    ) => {
        const booking = await this.updateBookingStatusUseCase.execute({
            bookingId: req.params.bookingId,
            status: req.body.status,
        });

        return res.status(200).json(booking);
    };

    cancelBooking = async (
        req: Request<BookingIdParams, BookingView>,
        res: Response<BookingView>
    ) => {
        if (!req.user) {
            throw new UnauthorizedError("Error de autenticacion.");
        }

        const booking = await this.cancelBookingUseCase.execute({
            bookingId: req.params.bookingId,
            requesterId: req.user.id,
        });

        return res.status(200).json(booking);
    };

    deleteBooking = async (
        req: Request<BookingIdParams, void>,
        res: Response<void>
    ) => {
        await this.deleteBookingUseCase.execute({
            bookingId: req.params.bookingId,
        });

        return res.status(204).send();
    };

    rescheduleBooking = async (
        req: Request<BookingIdParams, BookingView, RescheduleBookingBody>,
        res: Response<BookingView>
    ) => {
        if (!req.user) {
            throw new UnauthorizedError("Error de autenticacion.");
        }

        const booking = await this.rescheduleBookingUseCase.execute({
            bookingId: req.params.bookingId,
            requesterId: req.user.id,
            date: req.body.date,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
        });

        return res.status(200).json(booking);
    };
}
