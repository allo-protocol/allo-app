"use client";

import Link from "next/link";
import { RegistrationApproveButton } from "~/components/registration/approve-button";
import { cn } from "~/lib/utils";
import { Registration } from "~/schemas";

export function ApproveItem({
  id,
  metadata,
  isLoading,
}: Registration & { isLoading?: boolean }) {
  return (
    <div
      className={cn("p-2 border rounded h-14", {
        ["animate-pulse bg-gray-100"]: isLoading,
      })}
    >
      <div className="flex justify-between items-center">
        <Link href={`/project/${id}`}>
          <h3 className="underline">{metadata?.title}</h3>
        </Link>
        <RegistrationApproveButton id={id} />
      </div>
    </div>
  );
}
