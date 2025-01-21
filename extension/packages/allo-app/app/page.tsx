"use client";
import Link from "next/link";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";
import { useCart } from "~/components/cart/use-cart";
import { useContracts } from "~/hooks/use-contracts";
import { ProjectsList } from "~/components/registration/projects-list";

export default function Home() {
  const { AlloIRL } = useContracts();
  const cart = useCart();

  return (
    <Page
      title="Discover Projects"
      actions={
        <Link href={`/checkout`}>
          <Button
            disabled={!cart.list.length}
          >{`Add ${cart.list.length} to cart`}</Button>
        </Link>
      }
    >
      <ProjectsList
        query={{
          limit: 100,
          where: {
            // List approved projects for this strategy
            strategy_in: [AlloIRL?.address],
            index: 0, // Index 0 is always the project
            isApproved: true,
          },
        }}
      />
    </Page>
  );
}
