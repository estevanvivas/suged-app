import {SupabaseBookingRepository} from "@bookings-module/infrastructure/supabase/supabase-booking.repository";
import {CreateRecurringBlockUseCase} from "@venues-module/application/use-cases/create-recurring-block.usecase";
import {CreateVenueBlockUseCase} from "@venues-module/application/use-cases/create-venue-block.usecase";
import {CreateVenueUseCase} from "@venues-module/application/use-cases/create-venue.usecase";
import {DeleteRecurringBlockUseCase} from "@venues-module/application/use-cases/delete-recurring-block.usecase";
import {DeleteVenueBlockUseCase} from "@venues-module/application/use-cases/delete-venue-block.usecase";
import {DeleteVenueUseCase} from "@venues-module/application/use-cases/delete-venue.usecase";
import {GetRecurringBlockUseCase} from "@venues-module/application/use-cases/get-recurring-block.usecase";
import {GetVenueAvailableTimeSlotsUseCase} from "@venues-module/application/use-cases/get-venue-available-time-slots.usecase";
import {GetVenueCalendarUseCase} from "@venues-module/application/use-cases/get-venue-calendar.usecase";
import {ListRecurringBlocksUseCase} from "@venues-module/application/use-cases/list-recurring-blocks.usecase";
import {UpdateRecurringBlockUseCase} from "@venues-module/application/use-cases/update-recurring-block.usecase";
import {UpdateVenueUseCase} from "@venues-module/application/use-cases/update-venue.usecase";
import {UpsertVenueScheduleUseCase} from "@venues-module/application/use-cases/upsert-recurring-schedule.usecase";
import {SupabaseVenueRepository} from "./infrastructure/supabase/supabase-vanue.repository";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {createVenueRoutes} from "@venues-module/interfaces/http/venue.routes";

const venueRepository = new SupabaseVenueRepository();
const bookingRepository = new SupabaseBookingRepository();
const getVenueAvailableTimeSlotsUseCase = new GetVenueAvailableTimeSlotsUseCase(venueRepository, bookingRepository);

const venueController = new VenueController(
    new CreateVenueUseCase(venueRepository),
    new UpdateVenueUseCase(venueRepository),
    new DeleteVenueUseCase(venueRepository),
    getVenueAvailableTimeSlotsUseCase,
    new GetVenueCalendarUseCase(venueRepository, getVenueAvailableTimeSlotsUseCase),
    new UpsertVenueScheduleUseCase(venueRepository, bookingRepository),
    new CreateVenueBlockUseCase(venueRepository),
    new DeleteVenueBlockUseCase(venueRepository),
    new ListRecurringBlocksUseCase(venueRepository),
    new GetRecurringBlockUseCase(venueRepository),
    new CreateRecurringBlockUseCase(venueRepository),
    new UpdateRecurringBlockUseCase(venueRepository),
    new DeleteRecurringBlockUseCase(venueRepository),
);

export const venueRoutes = createVenueRoutes(venueController);
