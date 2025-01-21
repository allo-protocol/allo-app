"use client";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";
import { ClaimVoteTokens } from "~/components/claim-vote-tokens";
import { AllocationForm } from "~/components/allocation/allocation-form";

export default function CheckoutPage() {
  const { AlloIRL, VoteToken } = useContracts();
  return (
    <Page title="Checkout">
      <div className="mb-4">
        <ClaimVoteTokens tokenAddress={VoteToken.address} />
      </div>

      <AllocationForm
        strategyAddress={AlloIRL.address}
        tokenAddress={VoteToken.address}
      />
    </Page>
  );
}
