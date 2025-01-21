import { Address, formatUnits } from "viem";
import { useToken } from "~/components/token/use-token";
import { formatNumber } from "~/lib/format";

export function TokenAmount({
  amount = 0,
  token,
  hideSymbol = false,
}: {
  amount: number | bigint;
  token: Address;
  hideSymbol?: boolean;
}) {
  const { data } = useToken(token);

  if (!data) return null;
  const formattedAmount = formatNumber(
    Number(formatUnits(BigInt(amount), data?.decimals ?? 18))
  );

  return <>{`${formattedAmount} ${hideSymbol ? "" : data?.symbol}`}</>;
}
