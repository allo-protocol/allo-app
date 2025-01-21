"use client";
import { ShoppingCart, XIcon } from "lucide-react";
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
import { Grid } from "../grid";
import { Registration } from "~/schemas";

export function AllocationForm({
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
  const projects = useProjects({
    where: { address_in: Object.keys(cart.items) as Address[] },
  });
  const error = projects.error || allocate.error;
  return (
    <form
      className="space-y-2"
      onSubmit={async (e) => {
        e.preventDefault();
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
      <Grid
        columns={[1]}
        loadingItems={3}
        isPending={projects.isPending}
        data={projects.data?.items}
        error={error}
        emptyState={{
          title: "Cart Empty",
          description: "Add projects to your cart to allocate",
          icon: ShoppingCart,
        }}
        renderItem={(project, i) => (
          <AllocationItem
            key={project?.address}
            {...project}
            value={cart.items[project?.address as Address]}
            onUpdate={(value) => cart.set(project?.address, value)}
            onRemove={() => () => cart.set(project.address)}
          />
        )}
      />

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
            className="w-48"
            type="submit"
            disabled={!cart.list.length}
            isLoading={allocate.isPending}
          >
            Transfer tokens
          </Button>
        </AllowanceCheck>
      </div>
    </form>
  );
}

function AllocationItem({
  address,
  metadata,
  value,
  onUpdate,
  onRemove,
}: Registration & {
  value?: number;
  onUpdate: (value?: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative sm:flex border p-2 rounded">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{metadata?.title}</h3>
        <code className="text-sm">{address}</code>
      </div>
      <Input
        name={address}
        className="sm:w-48 sm:mr-10"
        placeholder="0"
        type="number"
        min={0}
        value={value}
        onChange={(e) =>
          onUpdate(e.target.value ? Number(e.target.value) : undefined)
        }
      />
      <Button
        className="absolute top-2 right-2"
        tabIndex={-1}
        size={"icon"}
        icon={XIcon}
        variant={"ghost"}
        type="button"
        onClick={onRemove}
      />
    </div>
  );
}
