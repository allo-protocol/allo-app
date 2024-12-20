"use client";

import { ComponentProps, useState } from "react";
import { CheckIcon } from "lucide-react";
import { Address } from "viem";
import { Page } from "./page";
import { Button } from "./ui/button";
import { Grant, useGrants } from "~/hooks/use-grants";

export function DiscoverGrants() {
  const [cart, setCart] = useState<Record<Address, boolean>>({});

  const { data: grants } = useGrants({ first: 12, skip: 0, where: {} });

  // Build arrays of selected grants
  const [recipients, amounts] = Object.entries(cart).reduce(
    (acc, [address, isSelected]) =>
      isSelected ? [acc[0].concat(address), acc[1].concat(10)] : acc,
    [[], []] as [string[], number[]]
  );

  return (
    <Page
      title="Discover Grants"
      actions={
        <Button
          onClick={() => {
            alert("not implemented yet");
            setCart({});
          }}
          disabled={!recipients.length}
        >{`Allocate to ${recipients.length} Grants`}</Button>
      }
    >
      <div className="grid sm:grid-cols-2 gap-2">
        {grants?.map((grant) => (
          <GrantCard
            key={grant.address}
            grant={grant}
            inCart={cart[grant.address]}
            onClick={() =>
              setCart((s) => ({ ...s, [grant.address]: !s[grant.address] }))
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
          <h3>{grant?.name}</h3>
          <span className="font-mono text-xs">{grant?.address}</span>
        </div>
        <div>{inCart ? <CheckIcon className="size-4" /> : null}</div>
      </div>
    </div>
  );
}
