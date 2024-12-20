"use client";

import { useMutation } from "@tanstack/react-query";
import { Address, Hex } from "viem";
import { strategyAbi, useWriteStrategyRegister } from "~/generated/wagmi";
import { useWaitForEvent } from "./use-wait-for-event";
import { useContracts } from "./use-contracts";
import { useToast } from "./use-toast";
import { extractErrorReason } from "~/lib/extract-error";

export function useRegister() {
  const { YourContract } = useContracts();
  const { toast } = useToast();
  const register = useWriteStrategyRegister();

  const waitFor = useWaitForEvent(strategyAbi);

  return useMutation({
    mutationFn: async (args: [Address, string, Hex]) => {
      const hash = await register.writeContractAsync(
        { address: YourContract.address, args },
        {
          onSuccess: () => toast({ title: "Grant Registered!" }),
          onError: (error) =>
            toast({
              title:
                extractErrorReason(String(error)) ?? "Register Grant error",
              variant: "destructive",
            }),
        }
      );
      return waitFor<{ project: string }>(hash, "Register");
    },
  });
}
