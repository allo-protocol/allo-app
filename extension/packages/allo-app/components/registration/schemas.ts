import { z } from "zod";
import { MetadataSchema } from "~/schemas/metadata";
import { EthAddressSchema } from "~/schemas/address";

export const RegistrationSchema = z.object({
  address: EthAddressSchema,
  metadata: MetadataSchema,
});
