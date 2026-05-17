import {Router} from "express";

import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {BookingController} from "@bookings-module/interfaces/http/booking.controller";
import {bookingIdParamsSchema} from "@bookings-module/interfaces/http/validation/booking-id-params.schema";
import {createBookingBodySchema} from "@bookings-module/interfaces/http/validation/create-booking.schema";
import {updateBookingStatusBodySchema} from "@bookings-module/interfaces/http/validation/update-booking-status.schema";

export const createBookingRoutes = (controller: BookingController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthentication,
        validateBody(createBookingBodySchema),
        controller.createBooking
    );

    router.patch(
        "/:bookingId/estado",
        requireAuthenticatedAdmin,
        validateParams(bookingIdParamsSchema),
        validateBody(updateBookingStatusBodySchema),
        controller.updateBookingStatus
    );

    return router;
};
