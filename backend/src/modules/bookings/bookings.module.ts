import {CancelBookingUseCase} from "@bookings-module/application/use-cases/cancel-booking.usecase";
import {CreateBookingUseCase} from "@bookings-module/application/use-cases/create-booking.usecase";
import {DeleteBookingUseCase} from "@bookings-module/application/use-cases/delete-booking.usecase";
import {GetBookingByIdUseCase} from "@bookings-module/application/use-cases/get-booking-by-id.usecase";
import {GetMyBookingsUseCase} from "@bookings-module/application/use-cases/get-my-bookings.usecase";
import {RescheduleBookingUseCase} from "@bookings-module/application/use-cases/reschedule-booking.usecase";
import {UpdateBookingStatusUseCase} from "@bookings-module/application/use-cases/update-booking-status.usecase";
import {SupabaseBookingRepository} from "@bookings-module/infrastructure/supabase/supabase-booking.repository";
import {BookingController} from "@bookings-module/interfaces/http/booking.controller";
import {createBookingRoutes} from "@bookings-module/interfaces/http/booking.routes";
import {SupabaseVenueRepository} from "@venues-module/infrastructure/supabase/supabase-vanue.repository";

const bookingRepository = new SupabaseBookingRepository();
const venueRepository = new SupabaseVenueRepository();

const bookingController = new BookingController(
    new CreateBookingUseCase(bookingRepository, venueRepository),
    new UpdateBookingStatusUseCase(bookingRepository),
    new GetMyBookingsUseCase(bookingRepository),
    new GetBookingByIdUseCase(bookingRepository),
    new CancelBookingUseCase(bookingRepository),
    new DeleteBookingUseCase(bookingRepository),
    new RescheduleBookingUseCase(bookingRepository, venueRepository)
);

export const bookingRoutes = createBookingRoutes(bookingController);
