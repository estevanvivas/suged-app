import {Router} from "express";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {
    getVenueAvailableTimeSlotsQuerySchema,
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {validateQuery} from "@infra/http/middlewares/query-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {
    upsertVenueScheduleBodySchema,
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schemas";
import {createVenueBodySchema} from "@venues-module/interfaces/http/validation/create-venue.schema";
import {venueIdParamsSchema} from "@venues-module/interfaces/http/validation/venue-id-params.schema";
import {createVenueBlockBodySchema} from "@venues-module/interfaces/http/validation/create-venue-block.schemas";
import {blockIdParamsSchema} from "@venues-module/interfaces/http/validation/block-id-params.schema";

export const createVenueRoutes = (controller: VenueController) => {
    const router = Router();

    router.post(
        "/",
        requireAuthenticatedAdmin,
        validateBody(createVenueBodySchema),
        controller.createVenue
    );

    router.get(
        "/venues/:venueId/available-time-slots",
        requireAuthentication,
        validateParams(venueIdParamsSchema),
        validateQuery(getVenueAvailableTimeSlotsQuerySchema),
        controller.getAvailableTimeSlots
    );

    router.post(
        "/venues/:venueId/schedules",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(upsertVenueScheduleBodySchema),
        controller.upsertVenueSchedule
    );

    router.post(
        "/venues/:venueId/blocks",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(createVenueBlockBodySchema),
        controller.createVenueBlock
    )

    router.delete(
        "/venues/blocks/:blockId",
        requireAuthenticatedAdmin,
        validateParams(blockIdParamsSchema),
        controller.deleteVenueBlock
    )

    return router;
};