"use client";

import { useAccount, useWriteContract } from "wagmi";
import { Address, erc20Abi, getAddress, parseUnits } from "viem";
import { Terminal } from "lucide-react";
import { useToken } from "~/components/token/use-token";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";
import { useInvalidate } from "~/hooks/use-invalidate";

export function MintTokens({ tokenAddress }: { tokenAddress: Address }) {
  const { address } = useAccount();
  const invalidate = useInvalidate();
  const waitForEvent = useWaitForEvent(erc20Abi);
  const { writeContractAsync, isPending } = useWriteContract();

  const { data: balance, queryKey } = useToken(tokenAddress, address);

  return (
    <Alert>
      <Terminal className="size-4" />
      <AlertTitle>Mint test tokens</AlertTitle>
      <AlertDescription>
        You can mint test tokens to create and fund projects
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
              await writeContractAsync({
                address: tokenAddress,
                abi: [
                  {
                    inputs: [
                      {
                        internalType: "address",
                        name: "to",
                        type: "address",
                      },
                      {
                        internalType: "uint256",
                        name: "amount",
                        type: "uint256",
                      },
                    ],
                    name: "mint",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                  },
                ],
                functionName: "mint",
                args: [
                  getAddress(address!),
                  parseUnits("1000", balance?.decimals ?? 18),
                ],
              })
                .then((hash) => waitForEvent(hash, "Transfer"))
                .then((logs) => invalidate([queryKey]));
            }}
          >
            Mint Tokens
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

function MintButton() {}
