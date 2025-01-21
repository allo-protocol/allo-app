"use client";

import { useAccount, useWriteContract } from "wagmi";
import { Address, erc20Abi } from "viem";
import { Terminal } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToken } from "~/components/token/use-token";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { useToast } from "~/hooks/use-toast";
import { extractErrorReason } from "~/lib/extract-error";

export function ClaimVoteTokens({ tokenAddress }: { tokenAddress: Address }) {
  const { toast } = useToast();
  const { address } = useAccount();
  const waitForEvent = useWaitForEvent(erc20Abi);
  const { writeContractAsync, isPending } = useWriteContract();
  const queryClient = useQueryClient();

  const { data: balance, queryKey } = useToken(tokenAddress, address);
  return (
    <Alert>
      <Terminal className="size-4" />
      <AlertTitle>Claim Vote Tokens</AlertTitle>
      <AlertDescription>
        You can claim vote tokens to distribute to projects you wish to support.
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            Balance:
            <div className="font-semibold">
              {balance?.formatted ?? "0"} {balance?.symbol}
            </div>
          </div>
          <Button
            isLoading={isPending}
            onClick={async () => {
              await writeContractAsync(
                {
                  address: tokenAddress,
                  abi: [
                    {
                      name: "mint",
                      outputs: [],
                      stateMutability: "nonpayable",
                      type: "function",
                    },
                  ],
                  functionName: "mint",
                },
                {
                  onSuccess: () => toast({ title: "Vote tokens claimed!" }),
                  onError: (error) =>
                    toast({
                      title:
                        extractErrorReason(String(error)) ??
                        "Vote tokens claim error",
                      variant: "destructive",
                    }),
                }
              )
                .then((hash) => waitForEvent(hash, "Transfer"))
                .then((logs) => queryClient.invalidateQueries({ queryKey }));
            }}
          >
            Claim
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
