"use client";
import { XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAllocate } from "~/hooks/use-allocate";
import { buildAllocations, useCart } from "~/hooks/use-cart";
import { useGrants } from "~/hooks/use-grants";
import { AllowanceCheck } from "./allowance-check";
import { useContracts } from "~/hooks/use-contracts";
import { formatNumber } from "~/lib/format";
import { useToken } from "~/hooks/use-token";
import { useAccount } from "wagmi";

export function Checkout() {
  const { ERC20Mock, YourContract } = useContracts();
  const strategyAddress = YourContract.address;
  const tokenAddress = ERC20Mock.address;

  const cart = useCart();
  const { data: grants } = useGrants({
    where: { address_in: cart.list },
  });

  const { address } = useAccount();
  const token = useToken(tokenAddress, address);

  const allocate = useAllocate();

  const isPending = allocate.isPending;

  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("Allocate");
        const [recipients, amounts] = buildAllocations(
          cart.items,
          token.data?.decimals
        );

        allocate
          .mutateAsync([
            recipients,
            amounts,
            tokenAddress,
            recipients.map(() => "0x"), // Empty data
          ])
          .then(() => cart.reset());
      }}
    >
      {grants?.items?.map((grant, i) => (
        <div
          key={grant.address}
          className="relative sm:flex border p-2 rounded"
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{grant.metadata.title}</h3>
            <code className="text-sm">{grant.address}</code>
          </div>
          <Input
            autoFocus={i === 0}
            name={grant.address}
            className="sm:w-48 sm:mr-10"
            placeholder="0"
            type="number"
            step="0.000001"
            min={0}
            value={cart.items[grant.address] ?? ""}
            onChange={(e) => cart.set(grant.address, Number(e.target.value))}
          />
          <Button
            className="absolute top-2 right-2"
            tabIndex={-1}
            size={"icon"}
            icon={XIcon}
            variant={"ghost"}
            onClick={() => cart.set(grant.address)}
          />
        </div>
      ))}
      <div className="flex justify-end items-center gap-4">
        <div className="">
          <span className="text-gray-600 text-sm uppercase tracking-wider">
            Total:{" "}
          </span>
          {formatNumber(Number(cart.sum))} {token.data?.symbol}
        </div>
        <AllowanceCheck
          amount={cart.sum}
          tokenAddress={tokenAddress}
          spenderAddress={strategyAddress}
        >
          <Button isLoading={isPending}>Checkout</Button>
        </AllowanceCheck>
      </div>
    </form>
  );
}
