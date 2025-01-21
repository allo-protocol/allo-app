"use client";

import { useAccount, useWriteContract } from "wagmi";
import { erc20Abi, getAddress, parseUnits } from "viem";
import { Terminal } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToken } from "~/components/token/use-token";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { useContracts } from "~/hooks/use-contracts";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";

export function MintTokens() {
  return (
    <Alert>
      <Terminal className="size-4" />
      <AlertTitle>Mint test tokens</AlertTitle>
      <AlertDescription>
        You can mint test tokens to create and fund projects
        <MintButton />
      </AlertDescription>
    </Alert>
  );
}

function MintButton() {
  const { address } = useAccount();
  const waitForEvent = useWaitForEvent(erc20Abi);
  const { writeContractAsync, isPending } = useWriteContract();
  const queryClient = useQueryClient();
  const { ERC20Mock } = useContracts();

  const { data: balance, queryKey } = useToken(ERC20Mock.address, address);

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        Balance:
        <div className="font-semibold">
          {balance?.formatted} {balance?.symbol}
        </div>
      </div>
      <Button
        isLoading={isPending}
        onClick={async () => {
          await writeContractAsync({
            address: ERC20Mock.address,
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
            .then((logs) => {
              console.log(logs);
              return queryClient.invalidateQueries({ queryKey });
            });
        }}
      >
        Mint Tokens
      </Button>
    </div>
  );
}
