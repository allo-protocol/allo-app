import { z } from "zod";
import { MetadataSchema } from "./metadata";
import { EthAddressSchema } from "./address";

export const CreateProjectSchema = z.object({
  address: EthAddressSchema,
  metadata: MetadataSchema,
});
