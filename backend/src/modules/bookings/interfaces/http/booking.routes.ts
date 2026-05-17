import {Router} from "express";

import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {BookingController} from "@bookings-module/interfaces/http/booking.controller";
import {bookingIdParamsSchema} from "@bookings-module/interfaces/http/validation/booking-id-params.schema";
import {createBookingBodySchema} from "@bookings-module/interfaces/http/validation/create-booking.schema";
import {rescheduleBookingBodySchema} from "@bookings-module/interfaces/http/validation/reschedule-booking.schema";
import {updateBookingStatusBodySchema} from "@bookings-module/interfaces/http/validation/update-booking-status.schema";

export const createBookingRoutes = (controller: BookingController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthentication,
        validateBody(createBookingBodySchema),
        controller.createBooking
    );

    router.get(
        "/my",
        requireAuthentication,
        controller.getMyBookings
    );

    router.get(
        "/:bookingId",
        requireAuthentication,
        validateParams(bookingIdParamsSchema),
        controller.getBookingById
    );

    router.patch(
        "/:bookingId/status",
        requireAuthenticatedAdmin,
        validateParams(bookingIdParamsSchema),
        validateBody(updateBookingStatusBodySchema),
        controller.updateBookingStatus
    );

    router.patch(
        "/:bookingId/cancel",
        requireAuthentication,
        validateParams(bookingIdParamsSchema),
        controller.cancelBooking
    );

    router.patch(
        "/:bookingId/reschedule",
        requireAuthentication,
        validateParams(bookingIdParamsSchema),
        validateBody(rescheduleBookingBodySchema),
        controller.rescheduleBooking
    );

    router.delete(
        "/:bookingId",
        requireAuthenticatedAdmin,
        validateParams(bookingIdParamsSchema),
        controller.deleteBooking
    );

    return router;
};
