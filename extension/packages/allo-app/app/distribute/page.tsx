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

export default function DistributePage() {
  const { AlloIRL, ERC20Mock, VoteToken } = useContracts();
  const { data: allocations } = useAllocations({
    where: {
      // Only fetch allocations for this strategy and only vote tokens
      strategy_in: [AlloIRL.address],
      tokenAddress_in: [VoteToken.address],
    },
  });
  const distributions = useAllocations({
    where: {
      // Only fetch allocations for this strategy and distributions of matching funds (from === strategy address)
      strategy_in: [AlloIRL.address],
      from_in: [AlloIRL.address],
    },
  });
  const queryClient = useQueryClient();
  const tokenAddress = ERC20Mock.address;
  const votes = allocations?.items ?? [];
  const voterCountById = getContributions(votes);
  const token = useToken(tokenAddress, AlloIRL.address);
  const distribute = useDistribute({ strategyAddress: AlloIRL.address });
  const matchingFunds = token.data?.balance ?? BigInt(0);
  const matching = calculateQuadraticMatching(votes, matchingFunds);

  const { data: projects } = useProjects({
    where: {
      address_in: votes.map((alloc) => alloc.registration.address),
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
  console.log(items);
  return (
    <Page
      title="Distribute"
      actions={
        <Button
          disabled={!matchingFunds}
          isLoading={distribute.isPending}
          onClick={() => {
            const [recipients, amounts] = buildAllocations(matching, 0);
            console.log(matching, recipients, amounts);
            console.log(amounts.reduce((sum, x) => sum + x, BigInt(0)));
            distribute
              .mutateAsync([
                recipients,
                amounts,
                tokenAddress,
                recipients.map(() => "0x"),
              ])
              .then(() => {
                queryClient.invalidateQueries({ queryKey: token.queryKey });
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
      <MintTokens />
      <div className="pb-2 mt-2 mb-4 border-b sm:flex items-center justify-between">
        Matching funds:{" "}
        <TokenAmount amount={matchingFunds} token={tokenAddress} />
        <MatchingFunds
          strategyAddress={AlloIRL.address}
          tokenAddress={tokenAddress}
        />
      </div>

      <Grid
        columns={[1]}
        data={items}
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
  const { AlloIRL } = useContracts();
  const [value, setValue] = useState<string>("");
  const fund = useDeposit({ strategyAddress });
  const withdraw = useWithdraw({ strategyAddress });
  const token = useToken(tokenAddress, AlloIRL.address);

  console.log(token.data);
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
        <Button type="submit" variant={"secondary"} disabled={!value}>
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
