"use client";

import { ComponentProps } from "react";
import { CheckIcon } from "lucide-react";
import { Page } from "./page";
import { Button } from "./ui/button";
import { Grant, useGrants } from "~/hooks/use-grants";
import Link from "next/link";
import { useCart } from "~/hooks/use-cart";

export function DiscoverGrants() {
  const cart = useCart();
  const { data: grants } = useGrants({ first: 12, skip: 0, where: {} });

  return (
    <Page
      title="Discover Grants"
      actions={
        <Link href={`/checkout`}>
          <Button
            disabled={!cart.list.length}
          >{`Allocate to ${cart.list.length} Grants`}</Button>
        </Link>
      }
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {grants?.items?.map((grant) => (
          <GrantCard
            key={grant.address}
            grant={grant}
            inCart={cart.contains(grant.address)}
            onClick={() =>
              cart.set(
                grant.address,
                cart.contains(grant.address) ? undefined : 0
              )
            }
          />
        ))}
      </div>
    </Page>
  );
}

function GrantCard({
  grant,
  inCart,
  onClick,
}: { grant?: Grant; inCart: boolean } & ComponentProps<"div">) {
  return (
    <div
      className="border p-1 rounded cursor-pointer hover:bg-gray-100 flex justify-between"
      onClick={onClick}
    >
      <div className="flex flex-1 gap-2">
        <div className="size-16 bg-gray-200 rounded" />
        <div className="flex-1">
          <h3>{grant?.metadata.title}</h3>
          <code className="text-xs">{grant?.address}</code>
        </div>
        <div>{inCart ? <CheckIcon className="size-4" /> : null}</div>
      </div>
    </div>
  );
}
