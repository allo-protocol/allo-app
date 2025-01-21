"use client";

import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import {
  allocatorAbi,
  registryAbi,
  useWriteRegistryApprove,
  useWriteRegistryRegister,
} from "~/generated/wagmi";
import { extractErrorReason } from "~/lib/extract-error";
import { REGISTRATIONS_SCHEMA } from "~/queries";
import { Registration } from "~/schemas";
import { useToast } from "~/hooks/use-toast";
import { IndexerQuery, useIndexer } from "~/hooks/use-indexer";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";

// Register a Project or Application
// calls contract Registry.register
export function useRegister({ strategyAddress }: { strategyAddress: Address }) {
  const { toast } = useToast();
  const register = useWriteRegistryRegister();

  const waitFor = useWaitForEvent(registryAbi);

  return useMutation({
    mutationFn: async (args: [Address, string, Hex]) => {
      const hash = await register.writeContractAsync(
        { address: strategyAddress, args },
        {
          onSuccess: () => toast({ title: "Project Registered!" }),
          onError: (error) =>
            toast({
              title:
                extractErrorReason(String(error)) ?? "Register Project error",
              variant: "destructive",
            }),
        }
      );
      return waitFor<{ project: string }>(hash, "Register");
    },
  });
}

// Approve Project or Application
// calls Registry.approve
export function useRegistryApprove({
  strategyAddress,
}: {
  strategyAddress: Address;
}) {
  const { toast } = useToast();
  const approve = useWriteRegistryApprove({});

  const waitFor = useWaitForEvent(allocatorAbi);

  return useMutation({
    mutationFn: async (args: [Address, bigint, string, Hex]) => {
      const hash = await approve.writeContractAsync(
        { address: strategyAddress, args },
        {
          onSuccess: () => toast({ title: "Registration approved!" }),
          onError: (error) =>
            toast({
              title: extractErrorReason(String(error)) ?? "Approve error",
              variant: "destructive",
            }),
        }
      );
      return waitFor(hash, "Approve");
    },
  });
}

// Query created Projects and Applications
// emitted Register events
export function useRegistrations(variables: IndexerQuery) {
  return useIndexer<Registration>({
    queryKey: ["registrations", variables],
    variables,
    query: REGISTRATIONS_SCHEMA,
    queryFn: async (r) => r?.registrations,
  });
}
export function useRegistrationById(id: Hex) {
  const { data, ...rest } = useRegistrations({ where: { id } });
  return { ...rest, data: data?.items?.[0] };
}

// Query only Projects (index: 0)
export function useProjects(variables: IndexerQuery) {
  return useRegistrations({
    ...variables,
    where: { index: 0, ...variables.where },
  });
}
export function useProjectById(address: Address) {
  const { data, ...rest } = useProjects({ where: { address_in: [address] } });
  return { ...rest, data: data?.items?.[0] };
}
