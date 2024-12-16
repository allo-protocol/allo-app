import { PropsWithChildren, ReactNode } from "react";
import { BackButton } from "./back-button";

export function Page({
  actions,
  backLink,
  title,
  children,
}: PropsWithChildren<{
  actions?: ReactNode;
  backLink?: string;
  title: string;
}>) {
  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        {backLink && <BackButton href={backLink} />}
        <h1 className="w-full font-semibold">{title}</h1>

        {actions}
      </div>
      {children}
    </>
  );
}
