"use client";
import Link from "next/link";
import { ProjectsList } from "~/components/projects-list";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";
import { useCart } from "~/hooks/use-cart";
import { useContracts } from "~/hooks/use-contracts";

export default function Home() {
  const { SimpleGrants } = useContracts();
  const cart = useCart();

  return (
    <Page
      title="Discover Projects"
      actions={
        <Link href={`/checkout`}>
          <Button
            disabled={!cart.list.length}
          >{`Allocate to ${cart.list.length} Grants`}</Button>
        </Link>
      }
    >
      <ProjectsList
        query={{
          limit: 100,
          where: { strategy_in: [SimpleGrants?.address] },
        }}
      />
    </Page>
  );
}
