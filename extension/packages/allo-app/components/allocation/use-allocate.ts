"use client";

import {
  allocatorAbi,
  useWriteAllocatorAllocate,
  useWriteAllocatorDistribute,
} from "~/generated/wagmi";
import { useToast } from "~/hooks/use-toast";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { extractErrorReason } from "~/lib/extract-error";
import { ALLOCATIONS_SCHEMA } from "~/queries";
import { useIndexer, IndexerQuery } from "~/hooks/use-indexer";
import { useAccount } from "wagmi";
import { Allocation } from "~/schemas";

export function useAllocate({ strategyAddress }: { strategyAddress: Address }) {
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

export function useDistribute({
  strategyAddress,
}: {
  strategyAddress: Address;
}) {
  const { toast } = useToast();
  const distribute = useWriteAllocatorDistribute();

  const waitFor = useWaitForEvent(allocatorAbi);

  return useMutation({
    mutationFn: async (args: [Address[], bigint[], Address, Hex[]]) => {
      const hash = await distribute.writeContractAsync(
        { address: strategyAddress, args },
        {
          onSuccess: () => toast({ title: "Distributed!" }),
          onError: (error) =>
            toast({
              title: extractErrorReason(String(error)) ?? "Distributed error",
              variant: "destructive",
            }),
        }
      );
      return waitFor(hash, "Allocate");
    },
  });
}

// Deposit simply calls allocate with params to transfer tokens to the strategy
// Used to fund strategy contracts
export function useDeposit({ strategyAddress }: { strategyAddress: Address }) {
  const { mutate, mutateAsync, ...rest } = useAllocate({ strategyAddress });

  return {
    ...rest,
    mutate: ([amount, token]: [bigint, Address]) =>
      mutate([[strategyAddress], [amount], token, ["0x"]]),
    mutateAsync: ([amount, token]: [bigint, Address]) =>
      mutateAsync([[strategyAddress], [amount], token, ["0x"]]),
  };
}

// Withdraw simply calls distribute with params to transfer tokens to your address
// Used to withdraw funds from strategy contracts
export function useWithdraw({ strategyAddress }: { strategyAddress: Address }) {
  const { address } = useAccount();
  const { mutate, mutateAsync, ...rest } = useDistribute({ strategyAddress });

  return {
    ...rest,
    mutate: ([amount, token]: [bigint, Address]) =>
      mutate([[address!], [amount], token, ["0x"]]),
    mutateAsync: ([amount, token]: [bigint, Address]) =>
      mutateAsync([[address!], [amount], token, ["0x"]]),
  };
}

export function useAllocations(variables: IndexerQuery) {
  return useIndexer<Allocation>({
    queryKey: ["allocations", variables],
    variables,
    query: ALLOCATIONS_SCHEMA,
    queryFn: async (r) => r.allocations,
  });
}

export function useDistributions(
  strategyAddress: Address,
  variables: IndexerQuery
) {
  return useAllocations({
    ...variables,
    where: {
      strategy_in: [strategyAddress],
      from_in: [strategyAddress],
      ...variables.where,
    },
  });
}

export function useDeposits(strategyAddress: Address, variables: IndexerQuery) {
  return useAllocations({
    ...variables,
    where: {
      strategy_in: [strategyAddress],
      to_in: [strategyAddress],
      ...variables.where,
    },
  });
}
