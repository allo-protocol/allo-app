import Link from "next/link";
import type { ComponentProps } from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

export function BackButton({
  className,
  href,
  ...props
}: ComponentProps<typeof Button> & { href: string }) {
  return (
    <Link href={href}>
      <Button
        variant={"ghost"}
        size="icon"
        className={cn("rounded-full", className)}
        icon={ChevronLeft}
        {...props}
      />
    </Link>
  );
}
