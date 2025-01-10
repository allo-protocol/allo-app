"use client";

import { Address } from "viem";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "~/hooks/use-cart";
import { useProjectById } from "~/hooks/use-projects";
import { BackgroundImage } from "~/components/background-image";
import { Page } from "~/components/page";
import { Button } from "~/components/ui/button";
import { AllocationsTable } from "~/components/allocations-table";
import { Badge } from "~/components/ui/badge";

export default function ProjectDetailsPage() {
  const params = useParams();
  const address = params.address as Address;
  const cart = useCart();
  const router = useRouter();
  const { data: project } = useProjectById(address);
  return (
    <Page
      title={
        <div className="flex gap-2 items-center">
          {project?.metadata?.title!}{" "}
          <ApprovedBadge isApproved={project?.isApproved} />
        </div>
      }
      actions={
        <Button
          onClick={() => {
            cart.set(address, 1);
            router.push("/checkout");
          }}
        >
          Add To Cart
        </Button>
      }
    >
      <BackgroundImage
        src={project?.metadata.image}
        className="h-40 bg-gray-200"
      />
      <div className="py-8">{project?.metadata.description}</div>

      <h3 className=" font-semibold">Allocations</h3>
      <AllocationsTable
        query={{
          orderBy: "createdAt",
          orderDirection: "desc",
          where: { recipient_in: [address] },
        }}
      />
    </Page>
  );
}

function ApprovedBadge({ isApproved }: { isApproved?: boolean }) {
  return typeof isApproved === "undefined" ? null : (
    <Badge variant={isApproved ? "success" : "outline"}>
      {isApproved ? "Approved" : "Pending"}
    </Badge>
  );
}
