"use client";
import { Checkout } from "~/components/project-checkout";
import { MintTokens } from "~/components/mint-tokens";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";

export default function CheckoutPage() {
  const { ERC20Mock, SimpleGrants } = useContracts();
  return (
    <Page title="Checkout">
      <div className="mb-4">
        <MintTokens />
      </div>

      <Checkout
        strategyAddress={SimpleGrants.address}
        tokenAddress={ERC20Mock.address}
      />
    </Page>
  );
}
