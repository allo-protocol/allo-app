import { Address, isAddress } from "viem";
import { z } from "zod";

export const EthAddressSchema = z.custom<Address>(
  (val) => isAddress(val as Address),
  "Invalid address"
);
