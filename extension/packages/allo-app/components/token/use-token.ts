"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Address, erc20Abi, formatUnits } from "viem";
import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { useWaitForEvent } from "~/hooks/use-wait-for-event";

// Get token decimals, symbol, and account balance
export function useToken(address?: Address, account?: Address) {
  const contract = { address, abi: erc20Abi } as const;

  const { data, ...query } = useReadContracts({
    contracts: [
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
      ...(account // Check balanceOf if account is provided
        ? [{ ...contract, functionName: "balanceOf", args: [account] }]
        : []),
    ],
  });

  const [symbol, decimals = 0, balance] = data?.map((d) => d.result) ?? [];

  return {
    ...query,
    data: query.isPending
      ? null
      : {
          address,
          balance: balance as bigint | undefined,
          formatted: balance
            ? formatUnits(BigInt(balance as number), Number(decimals))
            : null,
          symbol: symbol as string,
          decimals: Number(decimals),
        },
  };
}

// Check token allowance for owner and spender
export function useAllowance(
  token: Address,
  owner: Address | undefined,
  spender: Address
) {
  return useReadContract({
    abi: erc20Abi,
    address: token,
    args: [owner!, spender],
    functionName: "allowance",
    query: { enabled: Boolean(owner && spender) },
  });
}

// Approve token transfers for spender
export function useApprove(token: Address, spender: Address) {
  const queryClient = useQueryClient();
  const approve = useWriteContract();

  // Get queryKey so we can invalidate it and refresh the state
  const { queryKey } = useAllowance(token, useAccount().address, spender);

  const waitForEvent = useWaitForEvent(erc20Abi);
  return {
    ...approve,
    writeContractAsync: (amount = BigInt(0)) =>
      approve
        .writeContractAsync({
          address: token,
          abi: erc20Abi,
          functionName: "approve",
          args: [spender, amount],
        })
        .then(async (hash) => {
          const logs = await waitForEvent(hash, "Approval");
          await queryClient.invalidateQueries({ queryKey });
          return logs;
        }),
  };
}
