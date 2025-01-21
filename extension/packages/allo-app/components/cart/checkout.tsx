"use client";
import { XIcon } from "lucide-react";
import { Address } from "viem";
import { useAccount } from "wagmi";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useAllocate } from "~/components/allocation/use-allocate";
import { buildAllocations, useCart } from "~/components/cart/use-cart";
import { AllowanceCheck } from "../token/allowance-check";
import { formatNumber } from "~/lib/format";
import { useToken } from "~/components/token/use-token";
import { useProjects } from "../registration/use-register";

export function Checkout({
  strategyAddress,
  tokenAddress,
}: {
  strategyAddress: Address;
  tokenAddress: Address;
}) {
  const { address } = useAccount();
  const token = useToken(tokenAddress, address);
  const cart = useCart();
  const allocate = useAllocate({ strategyAddress });
  const { data: projects } = useProjects({
    where: { address_in: Object.keys(cart.items) as Address[] },
  });

  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const [recipients, amounts] = buildAllocations(cart.items, 0);

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
      <div className="space-y-2">
        {projects?.items?.map((project, i) => (
          <div
            key={project.address}
            className="relative sm:flex border p-2 rounded"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {project.metadata.title}
              </h3>
              <code className="text-sm">{project.address}</code>
            </div>
            <Input
              autoFocus={i === 0}
              name={project.address}
              className="sm:w-48 sm:mr-10"
              placeholder="0"
              type="number"
              min={0}
              value={cart.items[project.address as Address] || ""}
              onChange={(e) =>
                cart.set(
                  project.address,
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
            />
            <Button
              className="absolute top-2 right-2"
              tabIndex={-1}
              size={"icon"}
              icon={XIcon}
              variant={"ghost"}
              type="button"
              onClick={() => cart.set(project.address)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end items-center gap-4">
        <div className="">
          <span className="text-gray-600 text-sm uppercase tracking-wider">
            Total:{" "}
          </span>
          {formatNumber(Number(cart.sum))} / {token.data?.formatted}
        </div>
        <Button type="button" variant="outline" onClick={() => cart.reset()}>
          Reset Cart
        </Button>
        <AllowanceCheck
          amount={cart.sum}
          tokenAddress={tokenAddress}
          spenderAddress={strategyAddress}
        >
          <Button
            type="submit"
            disabled={!cart.list.length}
            isLoading={allocate.isPending}
          >
            Vote
          </Button>
        </AllowanceCheck>
      </div>
    </form>
  );
}
