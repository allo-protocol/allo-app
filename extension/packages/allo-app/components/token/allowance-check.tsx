import { PropsWithChildren } from "react";
import { Address, parseUnits } from "viem";
import { useAccount } from "wagmi";
import {
  useAllowance,
  useApprove,
  useToken,
} from "~/components/token/use-token";
import { Button } from "~/components/ui/button";
import { TokenAmount } from "./token-amount";

export function AllowanceCheck({
  children,
  amount = BigInt(0),
  tokenAddress,
  spenderAddress,
}: PropsWithChildren<{
  amount: bigint;
  tokenAddress: Address;
  spenderAddress: Address;
}>) {
  const { address } = useAccount();

  const { data: allowance = 0 } = useAllowance(
    tokenAddress,
    address,
    spenderAddress
  );
  const approve = useApprove(tokenAddress, spenderAddress);
  const token = useToken(tokenAddress, address);
  const parsedAmount = parseUnits(String(amount), token.data?.decimals ?? 18);

  if (parsedAmount > allowance) {
    return (
      <Button
        type="button"
        isLoading={approve.isPending}
        onClick={() => approve.writeContractAsync(parsedAmount)}
      >
        Approve <TokenAmount amount={parsedAmount} token={tokenAddress} />
      </Button>
    );
  }
  if ((token.data?.balance ?? 0) < parsedAmount) {
    return (
      <Button disabled variant="ghost">
        Insufficient balance
      </Button>
    );
  }

  return <>{children}</>;
}
