import {z} from "zod";
import {venueIdParamsSchema} from "@venues-module/interfaces/http/validation/venue-id-params.schema";
import {blockIdParamsSchema} from "@venues-module/interfaces/http/validation/block-id-params.schema";

export const deleteVenueBlockParamsSchema = venueIdParamsSchema.extend(blockIdParamsSchema.shape)

export type DeleteVenueBlockParams = z.output<typeof deleteVenueBlockParamsSchema>;