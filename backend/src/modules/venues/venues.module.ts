import {SupabaseBookingRepository} from "@bookings-module/infrastructure/supabase/supabase-booking.repository";
import {CreateVenueBlockUseCase} from "@venues-module/application/use-cases/create-venue-block.usecase";
import {CreateVenueUseCase} from "@venues-module/application/use-cases/create-venue.usecase";
import {DeleteVenueBlockUseCase} from "@venues-module/application/use-cases/delete-venue-block.usecase";
import {DeleteVenueUseCase} from "@venues-module/application/use-cases/delete-venue.usecase";
import {GetVenueAvailableTimeSlotsUseCase} from "@venues-module/application/use-cases/get-venue-available-time-slots.usecase";
import {UpdateVenueUseCase} from "@venues-module/application/use-cases/update-venue.usecase";
import {UpsertVenueScheduleUseCase} from "@venues-module/application/use-cases/upsert-recurring-schedule.usecase";
import {SupabaseVenueRepository} from "@venues-module/infraestructure/supabase/supabase-vanue.repository";
import {VenueController} from "@venues-module/interfaces/http/venue.controller";
import {createVenueRoutes} from "@venues-module/interfaces/http/venue.routes";

const venueRepository = new SupabaseVenueRepository();
const bookingRepository = new SupabaseBookingRepository();

const venueController = new VenueController(
    new CreateVenueUseCase(venueRepository),
    new UpdateVenueUseCase(venueRepository),
    new DeleteVenueUseCase(venueRepository),
    new GetVenueAvailableTimeSlotsUseCase(venueRepository, bookingRepository),
    new UpsertVenueScheduleUseCase(venueRepository, bookingRepository),
    new CreateVenueBlockUseCase(venueRepository),
    new DeleteVenueBlockUseCase(venueRepository),
);

export const venueRoutes = createVenueRoutes(venueController);
