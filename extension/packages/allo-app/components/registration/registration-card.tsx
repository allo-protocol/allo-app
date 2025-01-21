"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { CheckIcon, PlusIcon } from "lucide-react";

import { formatNumber } from "~/lib/format";
import { cn } from "~/lib/utils";
import { Registration } from "~/schemas";
import { BackgroundImage } from "../background-image";
import { Button } from "../ui/button";
import { EnsName } from "../ens";

export function RegistrationCard({
  inCart,
  onSelect,
  isLoading,
  ...project
}: Registration & {
  inCart: boolean;
  isLoading?: boolean;
} & ComponentProps<"button">) {
  const allocations = project?.allocations?.items ?? [];
  const allocation = allocations.reduce((sum, x) => sum + +x.amount, 0);

  return (
    <div
      className={cn("border p-1 rounded flex justify-between", {
        ["animate-pulse"]: isLoading,
      })}
    >
      <div className="flex flex-1 gap-2">
        <BackgroundImage
          src={project?.metadata?.image}
          className="size-16 bg-gray-200 rounded"
        />
        <div className="flex-1">
          <Link href={`/project/${project?.address}`}>
            <h3 className="hover:underline">{project?.metadata?.title}</h3>
          </Link>
          {allocation ? (
            <div className="text-sm">
              Allocation: {formatNumber(allocation)}
            </div>
          ) : null}
          <code className="text-sm">
            <EnsName address={project?.address} />
          </code>
        </div>
        <Button
          size="icon"
          className="rounded-full"
          variant="ghost"
          disabled={isLoading}
          onClick={onSelect}
          icon={inCart ? CheckIcon : PlusIcon}
        />
      </div>
    </div>
  );
}
