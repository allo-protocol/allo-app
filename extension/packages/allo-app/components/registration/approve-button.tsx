"use client";

import { Hex } from "viem";
import { Button } from "~/components/ui/button";
import { useRegistrationById, useRegistryApprove } from "./use-register";
import { useInvalidate } from "~/hooks/use-invalidate";

export function RegistrationApproveButton({ id }: { id: Hex }) {
  const { data: registration, isPending, queryKey } = useRegistrationById(id);
  const invalidate = useInvalidate();

  const approve = useRegistryApprove({
    strategyAddress: registration?.strategy.address!,
  });
  if (isPending || registration?.isApproved) return null;

  return (
    <Button
      variant="outline"
      isLoading={approve.isPending}
      onClick={() =>
        approve
          .mutateAsync([
            registration?.address!,
            BigInt(registration?.index!),
            "",
            "0x",
          ])
          .then(() => invalidate([queryKey]))
      }
    >
      Approve
    </Button>
  );
}
