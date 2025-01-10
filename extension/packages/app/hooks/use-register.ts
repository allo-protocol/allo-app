"use client";

import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { registryAbi, useWriteRegistryRegister } from "~/generated/wagmi";
import { useWaitForEvent } from "./use-wait-for-event";
import { useToast } from "./use-toast";
import { extractErrorReason } from "~/lib/extract-error";

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
