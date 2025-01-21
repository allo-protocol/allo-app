import { Info, LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { createElement } from "react";

export type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: LucideIcon;
};
export function EmptyState({
  title = "Not results found!",
  description = "Couldn't find any results matching your query",
  icon = Info,
}: EmptyStateProps) {
  return (
    <Alert>
      {createElement(icon, { className: "size-4" })}
      <Info className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
