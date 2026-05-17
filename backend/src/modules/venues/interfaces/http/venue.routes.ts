import {Router} from "express";

import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {validateBody} from "@infra/http/middlewares/body-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {validateQuery} from "@infra/http/middlewares/query-validation.middleware";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {createRecurringBlockBodySchema} from "@venues-module/interfaces/http/validation/create-recurring-block.schema";
import {createVenueBlockBodySchema} from "@venues-module/interfaces/http/validation/create-venue-block.schema";
import {createVenueBodySchema} from "@venues-module/interfaces/http/validation/create-venue.schema";
import {deleteVenueBlockParamsSchema} from "@venues-module/interfaces/http/validation/delete-venue-block-params.schema";
import {
    getVenueAvailableTimeSlotsQuerySchema,
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {getVenueCalendarQuerySchema} from "@venues-module/interfaces/http/validation/get-venue-calendar.schema";
import {updateVenueBodySchema} from "@venues-module/interfaces/http/validation/update-venue.schema";
import {
    upsertVenueScheduleBodySchema,
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schema";
import {recurringBlockParamsSchema} from "@venues-module/interfaces/http/validation/recurring-block-params.schema";
import {updateRecurringBlockBodySchema} from "@venues-module/interfaces/http/validation/update-recurring-block.schema";
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

    router.get(
        "/:venueId/calendar",
        requireAuthentication,
        validateParams(venueIdParamsSchema),
        validateQuery(getVenueCalendarQuerySchema),
        controller.getCalendar
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

    router.get(
        "/:venueId/recurring-blocks",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        controller.listRecurringBlocks
    );

    router.get(
        "/:venueId/recurring-blocks/:recurringBlockId",
        requireAuthenticatedAdmin,
        validateParams(recurringBlockParamsSchema),
        controller.getRecurringBlock
    );

    router.post(
        "/:venueId/recurring-blocks",
        requireAuthenticatedAdmin,
        validateParams(venueIdParamsSchema),
        validateBody(createRecurringBlockBodySchema),
        controller.createRecurringBlock
    );

    router.patch(
        "/:venueId/recurring-blocks/:recurringBlockId",
        requireAuthenticatedAdmin,
        validateParams(recurringBlockParamsSchema),
        validateBody(updateRecurringBlockBodySchema),
        controller.updateRecurringBlock
    );

    router.delete(
        "/:venueId/recurring-blocks/:recurringBlockId",
        requireAuthenticatedAdmin,
        validateParams(recurringBlockParamsSchema),
        controller.deleteRecurringBlock
    );

    return router;
};
