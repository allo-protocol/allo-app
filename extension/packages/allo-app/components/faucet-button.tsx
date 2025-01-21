"use client";

import { useAccount, useBalance } from "wagmi";
import { Button } from "./ui/button";
import {
  formatEther,
  createWalletClient,
  http,
  parseEther,
  Address,
} from "viem";
import { hardhat } from "viem/chains";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { waitForTransactionReceipt } from "viem/actions";

export function FaucetButton() {
  const { address } = useAccount();
  const faucet = useFaucet(address);
  const { data: { value = BigInt(0) } = {} } = useBalance({ address });

  return (
    <Button
      variant={"ghost"}
      isLoading={faucet.isPending}
      onClick={() => faucet.mutate()}
    >
      {formatEther(value).slice(0, 5)} ETH
    </Button>
  );
}

const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

function useFaucet(address?: Address) {
  const queryClient = useQueryClient();
  const { queryKey } = useBalance({ address });
  const client = createWalletClient({ chain: hardhat, transport: http() });

  return useMutation({
    mutationFn: async () =>
      client
        .sendTransaction({
          account: FAUCET_ADDRESS,
          to: address,
          value: parseEther("1"),
        })
        .then((hash) =>
          waitForTransactionReceipt(client, { hash }).then(() =>
            // Update balance
            queryClient.invalidateQueries({ queryKey })
          )
        ),
  });
}
