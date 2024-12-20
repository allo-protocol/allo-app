"use client";

import { useWriteStrategyAllocate } from "~/generated/wagmi";
import { useContracts } from "./use-contracts";
import { useToast } from "./use-toast";
import { useWaitForEvent } from "./use-wait-for-event";
import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { extractErrorReason } from "~/lib/extract-error";

export function useAllocate() {
  const { YourContract } = useContracts();
  const { toast } = useToast();
  const allocate = useWriteStrategyAllocate({});

  const waitFor = useWaitForEvent(YourContract.abi);
  return useMutation({
    mutationFn: async (args: [Address[], bigint[], Address, Hex[]]) => {
      const hash = await allocate.writeContractAsync(
        { address: YourContract.address, args },
        {
          onSuccess: () => toast({ title: "Allocated!" }),
          onError: (error) =>
            toast({
              title: extractErrorReason(String(error)) ?? "Allocated error",
              variant: "destructive",
            }),
        }
      );
      return waitFor(hash, "Allocate");
    },
  });
}
