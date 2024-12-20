import { z } from "zod";
import { MetadataSchema } from "./metadata";
import { EthAddressSchema } from "./address";

export const CreateGrantSchema = z.object({
  address: EthAddressSchema,
  metadata: MetadataSchema,
});
