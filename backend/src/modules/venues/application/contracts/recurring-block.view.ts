import {DayOfWeek} from "@/core/domain/enums/day-of-week";

export interface RecurringBlockView {
    id: string;
    venueId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    reason: string | null;
    createdAt: string;
}
