"use client";

import { useChainId } from "wagmi";
import deployedContracts from "@se-2/nextjs/contracts/deployedContracts";

export function useContracts() {
  const chainId = useChainId();

  return deployedContracts[chainId];
}
