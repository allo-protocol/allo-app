"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { CheckIcon, PlusIcon } from "lucide-react";

import { formatNumber } from "~/lib/format";
import { useCart } from "~/hooks/use-cart";
import { Variables } from "~/hooks/use-indexer";
import { Project, useProjects } from "~/hooks/use-projects";
import { Button } from "./ui/button";
import { BackgroundImage } from "./background-image";

export function ProjectsList({ query }: { query: Variables }) {
  const cart = useCart();
  const { data: grants } = useProjects(query);
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {grants?.items?.map((project) => (
        <ProjectCard
          key={project.address}
          project={project}
          inCart={cart.contains(project.address)}
          onSelect={() =>
            cart.set(
              project.address,
              cart.contains(project.address) ? undefined : 0
            )
          }
        />
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  inCart,
  onSelect,
}: { project?: Project; inCart: boolean } & ComponentProps<"button">) {
  const allocations = project?.allocations?.items ?? [];
  const allocation = allocations.reduce((sum, x) => sum + x.amount, 0);

  return (
    <div className="border p-1 rounded flex justify-between">
      <div className="flex flex-1 gap-2">
        <BackgroundImage
          src={project?.metadata?.image}
          className="size-16 bg-gray-200 rounded"
        />
        <div className="flex-1">
          <Link href={`/project/${project?.address}`}>
            <h3 className="hover:underline">{project?.metadata.title}</h3>
          </Link>
          <div className="text-sm">Allocation: {formatNumber(allocation)}</div>
          <code className="text-sm">{project?.address}</code>
        </div>
        <Button
          size="icon"
          className="rounded-full"
          variant="ghost"
          onClick={onSelect}
          icon={inCart ? CheckIcon : PlusIcon}
        />
      </div>
    </div>
  );
}
