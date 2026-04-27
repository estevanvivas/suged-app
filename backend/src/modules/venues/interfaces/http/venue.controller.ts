import type {Request, Response} from "express";
import {Temporal} from "@js-temporal/polyfill";

import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {VenueView} from "@venues-module/application/contracts/venue.view";
import {CreateVenueBlockUseCase} from "@venues-module/application/use-cases/create-venue-block.usecase";
import {CreateVenueUseCase} from "@venues-module/application/use-cases/create-venue.usecase";
import {DeleteVenueBlockUseCase} from "@venues-module/application/use-cases/delete-venue-block.usecase";
import {DeleteVenueUseCase} from "@venues-module/application/use-cases/delete-venue.usecase";
import {
    GetVenueAvailableTimeSlotsUseCase
} from "@venues-module/application/use-cases/get-venue-available-time-slots.usecase";
import {UpdateVenueUseCase} from "@venues-module/application/use-cases/update-venue.usecase";
import {UpsertVenueScheduleUseCase} from "@venues-module/application/use-cases/upsert-recurring-schedule.usecase";
import {CreateVenueBlockBody} from "@venues-module/interfaces/http/validation/create-venue-block.schema";
import {CreateVenueBody} from "@venues-module/interfaces/http/validation/create-venue.schema";
import {DeleteVenueBlockParams} from "@venues-module/interfaces/http/validation/delete-venue-block-params.schema";
import {
    GetVenueAvailableTimeSlotsQuery
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {UpdateVenueBody} from "@venues-module/interfaces/http/validation/update-venue.schema";
import {
    UpsertVenueScheduleBody,
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schema";
import {VenueIdParams} from "@venues-module/interfaces/http/validation/venue-id-params.schema";

export class VenueController {
    constructor(
        private readonly createVenueUseCase: CreateVenueUseCase,
        private readonly updateVenueUseCase: UpdateVenueUseCase,
        private readonly deleteVenueUseCase: DeleteVenueUseCase,
        private readonly getVenueAvailableTimeSlotsUseCase: GetVenueAvailableTimeSlotsUseCase,
        private readonly upsertVenueScheduleUseCase: UpsertVenueScheduleUseCase,
        private readonly createVenueBlockUseCase: CreateVenueBlockUseCase,
        private readonly deleteVenueBlockUseCase: DeleteVenueBlockUseCase,
    ) {
    }

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

    upateVenue = async (
        req: Request<VenueIdParams, VenueView, UpdateVenueBody>,
        res: Response<VenueView>,
    ) => {
        const data = {
            id: req.params.venueId,
            ...req.body,
        }

        const updatedVenue = await this.updateVenueUseCase.execute(data);

        return res.status(200).json(updatedVenue);
    }

    deleteVenue = async (
        req: Request<VenueIdParams, void, Record<string, never>>,
        res: Response<void>,
    ) => {
        await this.deleteVenueUseCase.execute(req.params.venueId)
        return res.status(204).send();
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

    deleteVenueBlock = async (
        req: Request<DeleteVenueBlockParams, void, Record<string, never>>,
        res: Response<void>,
    ) => {
        await this.deleteVenueBlockUseCase.execute({
            venueId: req.params.venueId,
            blockId: req.params.blockId,
        });

        return res.status(204).send();
    }
}