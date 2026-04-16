import {Router} from "express";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {VenueAvailabilityController} from "@venues-module/interfaces/http/controllers/venue-availability.controller";
import {
    GetVenueAvailableTimeSlotsParams,
    GetVenueAvailableTimeSlotsQuery,
    getVenueAvailableTimeSlotsParamsSchema,
    getVenueAvailableTimeSlotsQuerySchema,
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schemas";
import {validateQuery} from "@infra/http/middlewares/query-validation.middleware";
import {validateParams} from "@infra/http/middlewares/params-validation.middleware";
import {requireAuthentication} from "@infra/http/middlewares/auth.middleware";

export const createVenueRoutes = (controller: VenueAvailabilityController) => {
    const router = Router();

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