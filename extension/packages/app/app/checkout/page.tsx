"use client";
import { Checkout } from "~/components/grant-checkout";
import { MintTokens } from "~/components/mint-tokens";
import { Page } from "~/components/page";

export default function CheckoutPage() {
  return (
    <Page title="Checkout">
      <div className="space-y-2">
        <MintTokens />
        <Checkout />
      </div>
    </Page>
  );
}
