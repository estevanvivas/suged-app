import {DayOfWeek} from "@/core/domain/enums/day-of-week";
import {TimeSlotView} from "@venues-module/application/contracts/time-slot.view";

export interface VenueCalendarDayView {
    date: string;
    dayOfWeek: DayOfWeek;
    isOpen: boolean;
    slots: TimeSlotView[];
}
