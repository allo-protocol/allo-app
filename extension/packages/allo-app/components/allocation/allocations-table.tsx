"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { IndexerQuery } from "~/hooks/use-indexer";
import { useAllocations } from "~/components/allocation/use-allocate";
import { TokenAmount } from "../token/token-amount";
import { EnsName } from "../ens";

export function AllocationsTable({ query }: { query: IndexerQuery }) {
  const { data: allocations } = useAllocations(query);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>To</TableHead>
          <TableHead>From</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allocations?.items.map((allocation) => (
          <TableRow key={allocation.id}>
            <TableCell>
              <TokenAmount
                amount={allocation.amount}
                token={allocation.token.address!}
              />
            </TableCell>
            <TableCell>
              <EnsName address={allocation.to} />
            </TableCell>{" "}
            <TableCell>
              <EnsName address={allocation.from} />
            </TableCell>
            <TableCell>
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(allocation.createdAt * 1000))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
