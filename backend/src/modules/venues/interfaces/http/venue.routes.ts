import {Router} from "express";

import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {validateQuery} from "@infra/http/middlewares/query-validation.middleware";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {createVenueBlockBodySchema} from "@venues-module/interfaces/http/validation/create-venue-block.schema";
import {createVenueBodySchema} from "@venues-module/interfaces/http/validation/create-venue.schema";
import {deleteVenueBlockParamsSchema} from "@venues-module/interfaces/http/validation/delete-venue-block-params.schema";
import {
    getVenueAvailableTimeSlotsQuerySchema,
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {updateVenueBodySchema} from "@venues-module/interfaces/http/validation/update-venue.schema";
import {
    upsertVenueScheduleBodySchema,
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schema";
import {venueIdParamsSchema} from "@venues-module/interfaces/http/validation/venue-id-params.schema";

export const createVenueRoutes = (controller: VenueController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthenticatedAdmin,
        validateBody(createVenueBodySchema),
        controller.createVenue
    );

    router.patch(
        "/:venueId/",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(updateVenueBodySchema),
        controller.upateVenue
    );

    router.delete(
        "/:venueId/",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        controller.deleteVenue
    );

    router.get(
        "/:venueId/available-time-slots",
        requireAuthentication,
        validateParams(venueIdParamsSchema),
        validateQuery(getVenueAvailableTimeSlotsQuerySchema),
        controller.getAvailableTimeSlots
    );

    router.post(
        "/:venueId/schedules",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(upsertVenueScheduleBodySchema),
        controller.upsertVenueSchedule
    );

    router.post(
        "/:venueId/blocks",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(createVenueBlockBodySchema),
        controller.createVenueBlock
    );

    router.delete(
        "/:venueId/blocks/:blockId",
        requireAuthenticatedAdmin,
        validateParams(deleteVenueBlockParamsSchema),
        controller.deleteVenueBlock
    );

    return router;
};