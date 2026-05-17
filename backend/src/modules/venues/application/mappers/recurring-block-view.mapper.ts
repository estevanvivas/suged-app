import {RecurringBlockView} from "@venues-module/application/contracts/recurring-block.view";
import {RecurringBlock} from "@venues-module/domain/entities/recurring-block.entity";

export class RecurringBlockViewMapper {
    static toView(block: RecurringBlock): RecurringBlockView {
        return {
            id: block.id,
            venueId: block.venueId,
            dayOfWeek: block.dayOfWeek,
            startTime: block.startTime.toString(),
            endTime: block.endTime.toString(),
            reason: block.reason,
            createdAt: block.createdAt.toString(),
        };
    }
}
