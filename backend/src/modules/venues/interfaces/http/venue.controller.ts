import type {Request, Response} from "express";
import {Temporal} from "@js-temporal/polyfill";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {
    GetVenueAvailableTimeSlotsUseCase
} from "@venues-module/application/use-cases/get-venue-available-time-slots.usecase";
import {
    GetVenueAvailableTimeSlotsQuery
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {VenueView} from "@venues-module/application/contracts/venue.view";
import {CreateVenueBody} from "@venues-module/interfaces/http/validation/create-venue.schema";
import {CreateVenueUseCase} from "@venues-module/application/use-cases/create-venue.usecase";
import {
    UpsertVenueScheduleBody,
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schemas";
import {UpsertVenueScheduleUseCase} from "@venues-module/application/use-cases/upsert-recurring-schedule.usecase";
import {VenueIdParams} from "@venues-module/interfaces/http/validation/venue-id-params.schema";
import {CreateVenueBlockBody} from "@venues-module/interfaces/http/validation/create-venue-block.schemas";
import {CreateVenueBlockUseCase} from "@venues-module/application/use-cases/create-venue-block.usecase";

export class VenueController {
    constructor(
        private readonly getVenueAvailableTimeSlotsUseCase: GetVenueAvailableTimeSlotsUseCase,
        private readonly createVenueUseCase: CreateVenueUseCase,
        private readonly upsertVenueScheduleUseCase: UpsertVenueScheduleUseCase,
        private readonly createVenueBlockUseCase: CreateVenueBlockUseCase
    ) {
    }

    getAvailableTimeSlots = async (
        req: Request<VenueIdParams, TimeSlotView[], unknown, GetVenueAvailableTimeSlotsQuery>,
        res: Response<TimeSlotView[]>
    ) => {
        const slots = await this.getVenueAvailableTimeSlotsUseCase.execute({
            venueId: req.params.venueId,
            date: Temporal.PlainDate.from(req.query.date),
        });

        return res.json(slots);
    };

    createVenue = async (
        req: Request<Record<string, never>, VenueView, CreateVenueBody>,
        res: Response<VenueView>
    ) => {
        const venue = await this.createVenueUseCase.execute({
            name: req.body.name,
            description: req.body.description,
            capacity: req.body.capacity,
        })

        return res.status(201).json(venue);
    }

    upsertVenueSchedule = async (
        req: Request<VenueIdParams, void, UpsertVenueScheduleBody>,
        res: Response<void>,
    ) => {
        await this.upsertVenueScheduleUseCase.execute({
            venueId: req.params.venueId,
            dayOfWeek: req.body.dayOfWeek,
            openingTime: req.body.openingTime,
            closingTime: req.body.closingTime
        });

        return res.status(204).send();
    }

    createVenueBlock = async (
        req: Request<VenueIdParams, void, CreateVenueBlockBody>,
        res: Response<void>,
    ) => {
        await this.createVenueBlockUseCase.execute({
            venueId: req.params.venueId,
            date: Temporal.PlainDate.from(req.body.date),
            startTime: Temporal.PlainTime.from(req.body.startTime),
            endTime: Temporal.PlainTime.from(req.body.endTime),
            reason: req.body.reason
        });

        return res.status(201).send();
    }
}