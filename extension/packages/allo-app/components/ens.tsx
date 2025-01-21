import { Address } from "viem";
import { useEnsName } from "wagmi";
import { truncate } from "~/lib/truncate";

export function EnsName({ address }: { address?: Address }) {
  const { data: name } = useEnsName({
    address,
    chainId: 1,
    query: { enabled: Boolean(address) },
  });

  return <>{name ?? truncate(address)}</>;
}
