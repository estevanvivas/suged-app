import {Router} from "express";

import {requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {BookingController} from "@bookings-module/interfaces/http/booking.controller";
import {createBookingBodySchema} from "@bookings-module/interfaces/http/validation/create-booking.schema";

export const createBookingRoutes = (controller: BookingController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthentication,
        validateBody(createBookingBodySchema),
        controller.createBooking
    );

    return router;
};
