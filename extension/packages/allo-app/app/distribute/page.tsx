"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Address, parseUnits } from "viem";
import { AllowanceCheck } from "~/components/token/allowance-check";
import { MintTokens } from "~/components/mint-tokens";
import { Page } from "~/components/page";
import { useProjects } from "~/components/registration/use-register";
import { TokenAmount } from "~/components/token/token-amount";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  useAllocations,
  useDeposit,
  useDistribute,
  useWithdraw,
} from "~/components/allocation/use-allocate";
import { buildAllocations } from "~/components/cart/use-cart";
import { useContracts } from "~/hooks/use-contracts";
import { useToken } from "~/components/token/use-token";
import { formatNumber } from "~/lib/format";
import { calculateQuadraticMatching, getContributions } from "~/lib/quadratic";
import { Registration } from "~/schemas";
import { Grid } from "~/components/grid";
import { EnsName } from "~/components/ens";
import { AllocationsTable } from "~/components/allocation/allocations-table";
import { useAccount } from "wagmi";
import { useInvalidate } from "~/hooks/use-invalidate";

export default function DistributePage() {
  const invalidate = useInvalidate();
  const { SimpleGrants, ERC20Mock } = useContracts();
  const { address } = useAccount();
  const tokenAddress = ERC20Mock.address;
  const allocations = useAllocations({
    where: {
      // Only fetch allocations for this strategy
      strategy_in: [SimpleGrants.address],
      // Not any transfers to or from this contract (fund / withdraw)
      to_not_in: [SimpleGrants.address],
      from_not_in: [SimpleGrants.address],
    },
  });
  const distributions = useAllocations({
    where: {
      // Only fetch allocations for this strategy and distributions of matching funds (from === strategy address)
      strategy_in: [SimpleGrants.address],
      from_in: [SimpleGrants.address],
    },
  });

  const donations = allocations.data?.items ?? [];

  const voterCountById = getContributions(donations);
  const token = useToken(tokenAddress, SimpleGrants.address);
  const distribute = useDistribute({ strategyAddress: SimpleGrants.address });
  const matchingFunds = token.data?.balance ?? BigInt(0);
  const matching = calculateQuadraticMatching(donations, matchingFunds);

  const { data: projects } = useProjects({
    where: {
      address_in: donations.map((alloc) => alloc.registration?.address),
    },
  });

  const projectById: Record<string, Registration> = (
    projects?.items ?? []
  ).reduce((acc, x) => ({ ...acc, [x.address]: x }), {});

  const items = Object.entries(matching)
    .sort(([_, shareA], [__, shareB]) => Number(shareB) - Number(shareA))
    .map(([address, share]) => ({
      ...projectById[address],
      share,
      voterCount: Object.keys(voterCountById[address as Address]).length,
    }));

  const isPending = distributions.isPending;
  const error = distributions.error;
  return (
    <Page
      title="Matching Funds"
      actions={
        <Button
          disabled={!matchingFunds}
          isLoading={distribute.isPending}
          onClick={() => {
            const [recipients, amounts] = buildAllocations(matching, 0);
            distribute
              .mutateAsync([
                recipients,
                amounts,
                tokenAddress,
                recipients.map(() => "0x"),
              ])
              .then(() => {
                invalidate([token.queryKey, allocations.queryKey]);
              });
          }}
        >
          Distribute Matching
        </Button>
      }
    >
      <p className="pb-4 text-lg">
        Add matching funds to be distributed to projects based on quadratic
        voting.
      </p>

      <div className="pb-2 mt-2 mb-4 border-b sm:flex items-center justify-between">
        Matching funds:{" "}
        <TokenAmount amount={matchingFunds} token={tokenAddress} />
        <MatchingFunds
          strategyAddress={SimpleGrants.address}
          tokenAddress={tokenAddress}
        />
      </div>

      <Grid
        columns={[1]}
        data={items}
        loadingItems={3}
        isPending={isPending}
        error={error}
        renderItem={(item, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b py-2"
          >
            <div className="flex-1">
              <h3>{item?.metadata?.title}</h3>
              <div className="font-mono text-xs">
                <EnsName address={item?.address} />
              </div>
            </div>
            <div className="px-4">
              <TokenAmount amount={item?.share ?? 0n} token={tokenAddress} />
            </div>
            <div>{formatNumber(item.voterCount)} voters</div>
          </div>
        )}
      />
      <AllocationsTable
        query={{
          where: {
            // Only fetch allocations for this strategy
            strategy_in: [SimpleGrants.address],
            // Not any transfers to or from this contract (fund / withdraw)
            to_not_in: [address!],
            from_in: [SimpleGrants.address],
          },
          orderBy: "createdAt",
          orderDirection: "desc",
        }}
      />
      <div className="mt-4">
        <MintTokens tokenAddress={tokenAddress} />
      </div>
    </Page>
  );
}

function MatchingFunds({
  strategyAddress,
  tokenAddress,
}: {
  strategyAddress: Address;
  tokenAddress: Address;
}) {
  const querClient = useQueryClient();
  const { SimpleGrants } = useContracts();
  const [value, setValue] = useState<string>("");
  const fund = useDeposit({ strategyAddress });
  const withdraw = useWithdraw({ strategyAddress });
  const token = useToken(tokenAddress, SimpleGrants.address);

  return (
    <form
      className="flex gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        setValue("");
        if (!token.data?.decimals) throw new Error("Couldn't load token");
        fund
          .mutateAsync([parseUnits(value, token.data?.decimals), tokenAddress])
          .then(() => {
            setValue("");
            querClient.invalidateQueries({ queryKey: token.queryKey });
          });
      }}
    >
      <Input
        placeholder="0"
        value={value}
        onChange={(e) =>
          isNaN(+e.target.value) ? "" : setValue(e.target.value)
        }
      />
      <AllowanceCheck
        amount={BigInt(value ?? 0)}
        spenderAddress={strategyAddress}
        tokenAddress={tokenAddress}
      >
        <Button type="submit" disabled={!value}>
          Add matching funds
        </Button>
      </AllowanceCheck>
      <Button
        type="button"
        variant={"secondary"}
        disabled={!token.data?.balance}
        onClick={() =>
          withdraw
            .mutateAsync([token.data?.balance!, tokenAddress])
            .then(() => {
              querClient.invalidateQueries({ queryKey: token.queryKey });
            })
        }
      >
        Withdraw
      </Button>
    </form>
  );
}
