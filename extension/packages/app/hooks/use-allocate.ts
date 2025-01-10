"use client";

import { allocatorAbi, useWriteAllocatorAllocate } from "~/generated/wagmi";
import { useContracts } from "./use-contracts";
import { useToast } from "./use-toast";
import { useWaitForEvent } from "./use-wait-for-event";
import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { extractErrorReason } from "~/lib/extract-error";
import { ALLOCATIONS_SCHEMA } from "~/queries";
import { useIndexer, Variables } from "./use-indexer";
import { Allocation } from "./use-projects";

export function useAllocate({ strategyAddress }: { strategyAddress: Address }) {
  const { YourContract } = useContracts();
  const { toast } = useToast();
  const allocate = useWriteAllocatorAllocate({});

  const waitFor = useWaitForEvent(allocatorAbi);

  return useMutation({
    mutationFn: async (args: [Address[], bigint[], Address, Hex[]]) => {
      const hash = await allocate.writeContractAsync(
        { address: strategyAddress, args },
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

export function useAllocations(variables: Variables) {
  return useIndexer<Allocation>({
    queryKey: ["Allocations", variables],
    variables,
    query: ALLOCATIONS_SCHEMA,
    queryFn: async (r) => r.allocations,
  });
}
