import type {Request, Response} from "express";
import {Temporal} from "@js-temporal/polyfill";

import {RecurringBlockView} from "@venues-module/application/contracts/recurring-block.view";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";
import {VenueCalendarDayView} from "@venues-module/application/contracts/venue-calendar-day.view";
import {VenueView} from "@venues-module/application/contracts/venue.view";
import {CreateRecurringBlockUseCase} from "@venues-module/application/use-cases/create-recurring-block.usecase";
import {CreateVenueBlockUseCase} from "@venues-module/application/use-cases/create-venue-block.usecase";
import {CreateVenueUseCase} from "@venues-module/application/use-cases/create-venue.usecase";
import {DeleteRecurringBlockUseCase} from "@venues-module/application/use-cases/delete-recurring-block.usecase";
import {DeleteVenueBlockUseCase} from "@venues-module/application/use-cases/delete-venue-block.usecase";
import {DeleteVenueUseCase} from "@venues-module/application/use-cases/delete-venue.usecase";
import {GetRecurringBlockUseCase} from "@venues-module/application/use-cases/get-recurring-block.usecase";
import {
    GetVenueAvailableTimeSlotsUseCase
} from "@venues-module/application/use-cases/get-venue-available-time-slots.usecase";
import {GetVenueCalendarUseCase} from "@venues-module/application/use-cases/get-venue-calendar.usecase";
import {ListRecurringBlocksUseCase} from "@venues-module/application/use-cases/list-recurring-blocks.usecase";
import {UpdateVenueUseCase} from "@venues-module/application/use-cases/update-venue.usecase";
import {UpdateRecurringBlockUseCase} from "@venues-module/application/use-cases/update-recurring-block.usecase";
import {UpsertVenueScheduleUseCase} from "@venues-module/application/use-cases/upsert-recurring-schedule.usecase";
import {CreateRecurringBlockBody} from "@venues-module/interfaces/http/validation/create-recurring-block.schema";
import {CreateVenueBlockBody} from "@venues-module/interfaces/http/validation/create-venue-block.schema";
import {CreateVenueBody} from "@venues-module/interfaces/http/validation/create-venue.schema";
import {DeleteVenueBlockParams} from "@venues-module/interfaces/http/validation/delete-venue-block-params.schema";
import {
    GetVenueAvailableTimeSlotsQuery
} from "@venues-module/interfaces/http/validation/get-venue-available-time-slots.schema";
import {GetVenueCalendarQuery} from "@venues-module/interfaces/http/validation/get-venue-calendar.schema";
import {UpdateVenueBody} from "@venues-module/interfaces/http/validation/update-venue.schema";
import {
    UpsertVenueScheduleBody,
} from "@venues-module/interfaces/http/validation/upsert-venue-schedule.schema";
import {RecurringBlockParams} from "@venues-module/interfaces/http/validation/recurring-block-params.schema";
import {UpdateRecurringBlockBody} from "@venues-module/interfaces/http/validation/update-recurring-block.schema";
import {VenueIdParams} from "@venues-module/interfaces/http/validation/venue-id-params.schema";

export class VenueController {
    constructor(
        private readonly createVenueUseCase: CreateVenueUseCase,
        private readonly updateVenueUseCase: UpdateVenueUseCase,
        private readonly deleteVenueUseCase: DeleteVenueUseCase,
        private readonly getVenueAvailableTimeSlotsUseCase: GetVenueAvailableTimeSlotsUseCase,
        private readonly getVenueCalendarUseCase: GetVenueCalendarUseCase,
        private readonly upsertVenueScheduleUseCase: UpsertVenueScheduleUseCase,
        private readonly createVenueBlockUseCase: CreateVenueBlockUseCase,
        private readonly deleteVenueBlockUseCase: DeleteVenueBlockUseCase,
        private readonly listRecurringBlocksUseCase: ListRecurringBlocksUseCase,
        private readonly getRecurringBlockUseCase: GetRecurringBlockUseCase,
        private readonly createRecurringBlockUseCase: CreateRecurringBlockUseCase,
        private readonly updateRecurringBlockUseCase: UpdateRecurringBlockUseCase,
        private readonly deleteRecurringBlockUseCase: DeleteRecurringBlockUseCase,
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

    getCalendar = async (
        req: Request<VenueIdParams, VenueCalendarDayView[], unknown, GetVenueCalendarQuery>,
        res: Response<VenueCalendarDayView[]>
    ) => {
        const calendar = await this.getVenueCalendarUseCase.execute({
            venueId: req.params.venueId,
            from: Temporal.PlainDate.from(req.query.from),
            to: Temporal.PlainDate.from(req.query.to),
        });

        return res.json(calendar);
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

    listRecurringBlocks = async (
        req: Request<VenueIdParams, RecurringBlockView[]>,
        res: Response<RecurringBlockView[]>
    ) => {
        const blocks = await this.listRecurringBlocksUseCase.execute(req.params.venueId);
        return res.status(200).json(blocks);
    };

    getRecurringBlock = async (
        req: Request<RecurringBlockParams, RecurringBlockView>,
        res: Response<RecurringBlockView>
    ) => {
        const block = await this.getRecurringBlockUseCase.execute({
            venueId: req.params.venueId,
            blockId: req.params.recurringBlockId,
        });

        return res.status(200).json(block);
    };

    createRecurringBlock = async (
        req: Request<VenueIdParams, RecurringBlockView, CreateRecurringBlockBody>,
        res: Response<RecurringBlockView>
    ) => {
        const block = await this.createRecurringBlockUseCase.execute({
            venueId: req.params.venueId,
            dayOfWeek: req.body.dayOfWeek,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            reason: req.body.reason,
        });

        return res.status(201).json(block);
    };

    updateRecurringBlock = async (
        req: Request<RecurringBlockParams, RecurringBlockView, UpdateRecurringBlockBody>,
        res: Response<RecurringBlockView>
    ) => {
        const block = await this.updateRecurringBlockUseCase.execute({
            venueId: req.params.venueId,
            blockId: req.params.recurringBlockId,
            dayOfWeek: req.body.dayOfWeek,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            reason: req.body.reason,
        });

        return res.status(200).json(block);
    };

    deleteRecurringBlock = async (
        req: Request<RecurringBlockParams, void>,
        res: Response<void>
    ) => {
        await this.deleteRecurringBlockUseCase.execute({
            venueId: req.params.venueId,
            blockId: req.params.recurringBlockId,
        });

        return res.status(204).send();
    };
}
