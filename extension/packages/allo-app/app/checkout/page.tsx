"use client";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";
import { ClaimVoteTokens } from "~/components/claim-vote-tokens";
import { AllocationForm } from "~/components/allocation/allocation-form";

export default function CheckoutPage() {
  const { SimpleGrants, ERC20Mock } = useContracts();
  return (
    <Page title="Checkout">
      <div className="mb-4">
        <ClaimVoteTokens tokenAddress={ERC20Mock.address} />
      </div>

      <AllocationForm strategyAddress={SimpleGrants.address} tokenAddress={ERC20Mock.address} />
    </Page>
  );
}
