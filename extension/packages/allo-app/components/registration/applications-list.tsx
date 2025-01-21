"use client";

import { IndexerQuery } from "~/hooks/use-indexer";
import { Grid } from "../grid";
import { useRegistrations } from "./use-register";
import { ApproveItem } from "./approve-item";

export function ApplicationsList({ query }: { query: IndexerQuery }) {
  const { data, error, isPending } = useRegistrations(query);
  console.log(data);
  return (
    <Grid
      columns={[1]}
      data={data?.items}
      error={error}
      isPending={isPending}
      renderItem={(application) => (
        <ApproveItem key={application.address} {...application} />
      )}
    />
  );
}
