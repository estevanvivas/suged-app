import {Router} from "express";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {
    GetVenueAvailableTimeSlotsParams,
    GetVenueAvailableTimeSlotsQuery,
    getVenueAvailableTimeSlotsParamsSchema,
    getVenueAvailableTimeSlotsQuerySchema,
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {validateQuery} from "@infra/http/middlewares/query-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {requireAuthenticatedAdmin, requireAuthentication} from "@infra/http/middlewares/auth.middleware";
import {VenueView} from "@venues-module/application/contracts/venue.view";
import {CreateVenueBody} from "@venues-module/interfaces/http/validation/create-venue.schema";

export const createVenueRoutes = (controller: VenueController) => {
    const router = Router();

    router.post<
        Record<string, never>,
        VenueView,
        CreateVenueBody
    >(
        "/",
        requireAuthenticatedAdmin,
        validateParams(getVenueAvailableTimeSlotsParamsSchema),
        validateQuery(getVenueAvailableTimeSlotsQuerySchema),
        controller.createVenue
    );

    router.get<
        GetVenueAvailableTimeSlotsParams,
        TimeSlotView[],
        Record<string, never>,
        GetVenueAvailableTimeSlotsQuery
    >(
        "/:venueId/available-time-slots",
        requireAuthentication,
        validateParams(getVenueAvailableTimeSlotsParamsSchema),
        validateQuery(getVenueAvailableTimeSlotsQuerySchema),
        controller.getAvailableTimeSlots
    );

    return router;
};