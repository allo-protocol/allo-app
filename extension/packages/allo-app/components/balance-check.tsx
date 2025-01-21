import { PropsWithChildren } from "react";
import { useAccount, useBalance } from "wagmi";
import { Button } from "./ui/button";

export function BalanceCheck({ children }: PropsWithChildren) {
  const { address } = useAccount();
  const { data: { value = 0 } = {}, isPending } = useBalance({
    address,
  });

  if (isPending) return <Button variant={"outline"} isLoading />;

  if (value > 0) return <>{children}</>;

  return (
    <Button disabled variant="ghost">
      Insufficient balance
    </Button>
  );
}
