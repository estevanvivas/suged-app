import {Router} from "express";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {
    getVenueAvailableTimeSlotsParamsSchema, getVenueAvailableTimeSlotsQuerySchema,
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {validateQuery} from "@infra/http/middlewares/query-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {
    upsertVenueScheduleBodySchema,
    upsertVenueScheduleParamsSchema
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schemas";
import {createVenueBodySchema} from "@venues-module/interfaces/http/validation/create-venue.schema";

export const createVenueRoutes = (controller: VenueController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthenticatedAdmin,
        validateBody(createVenueBodySchema),
        controller.createVenue
    );

    router.get(
        "/:venueId/available-time-slots",
        requireAuthentication,
        validateParams(getVenueAvailableTimeSlotsParamsSchema),
        validateQuery(getVenueAvailableTimeSlotsQuerySchema),
        controller.getAvailableTimeSlots
    );

    router.post(
        "/:venueId/schedules",
        requireAuthenticatedAdmin,
        validateParams(upsertVenueScheduleParamsSchema),
        validateBody(upsertVenueScheduleBodySchema),
        controller.upsertVenueSchedule
    );

    return router;
};