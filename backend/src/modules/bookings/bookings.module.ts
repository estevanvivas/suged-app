import {CreateBookingUseCase} from "@bookings-module/application/use-cases/create-booking.usecase";
import {UpdateBookingStatusUseCase} from "@bookings-module/application/use-cases/update-booking-status.usecase";
import {SupabaseBookingRepository} from "@bookings-module/infrastructure/supabase/supabase-booking.repository";
import {BookingController} from "@bookings-module/interfaces/http/booking.controller";
import {createBookingRoutes} from "@bookings-module/interfaces/http/booking.routes";
import {SupabaseVenueRepository} from "@venues-module/infrastructure/supabase/supabase-vanue.repository";

const bookingRepository = new SupabaseBookingRepository();
const venueRepository = new SupabaseVenueRepository();

const bookingController = new BookingController(
    new CreateBookingUseCase(bookingRepository, venueRepository),
    new UpdateBookingStatusUseCase(bookingRepository)
);

export const bookingRoutes = createBookingRoutes(bookingController);
