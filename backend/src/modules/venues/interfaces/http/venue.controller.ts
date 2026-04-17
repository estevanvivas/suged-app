import type {Request, Response} from "express";
import {Temporal} from "@js-temporal/polyfill";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {
    GetVenueAvailableTimeSlotsUseCase
} from "@venues-module/application/use-cases/get-venue-available-time-slots.usecase";
import {
    GetVenueAvailableTimeSlotsParams,
    GetVenueAvailableTimeSlotsQuery
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";

export class VenueController {
    constructor(
        private readonly getVenueAvailableTimeSlotsUseCase: GetVenueAvailableTimeSlotsUseCase
    ) {
    }

    getAvailableTimeSlots = async (
        req: Request<GetVenueAvailableTimeSlotsParams, TimeSlotView[], unknown, GetVenueAvailableTimeSlotsQuery>,
        res: Response<TimeSlotView[]>
    ) => {
        const slots = await this.getVenueAvailableTimeSlotsUseCase.execute({
            venueId: req.params.venueId,
            date: Temporal.PlainDate.from(req.query.date),
        });

        return res.json(slots);
    };
}