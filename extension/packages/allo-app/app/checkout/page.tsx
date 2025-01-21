"use client";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";
import { AllocationForm } from "~/components/allocation/allocation-form";
import { MintTokens } from "~/components/mint-tokens";

export default function CheckoutPage() {
  const { SimpleGrants, ERC20Mock } = useContracts();
  return (
    <Page title="Checkout">
      <AllocationForm
        strategyAddress={SimpleGrants.address}
        tokenAddress={ERC20Mock.address}
      />
      <div className="mt-4">
        <MintTokens tokenAddress={ERC20Mock.address} />
      </div>
    </Page>
  );
}
