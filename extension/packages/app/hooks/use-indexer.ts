"use client";

import { useQuery } from "@tanstack/react-query";
import { OperationResult, TypedDocumentNode } from "urql";
import { Address } from "viem";
import { useChainId } from "wagmi";
import { createClient } from "~/lib/graphql";

export type Variables = {
  limit?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  where?: {
    address_in?: Address[];
    strategy_in?: Address[];
    recipient_in?: Address[];
  };
};

export function useIndexer<T>({
  queryKey,
  queryFn,
  query,
  variables,
  enabled = true,
}: {
  queryKey: unknown[];
  queryFn: (r: OperationResult["data"]) => Promise<{
    items: T[];
    totalCount: number;
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
    };
  }>;
  query: TypedDocumentNode;
  variables: Variables;
  enabled?: boolean;
}) {
  const chainId = useChainId();
  const client = createClient(chainId!);
  return useQuery({
    enabled: !!client && enabled,
    queryKey,
    queryFn: async () => {
      return client
        ?.query(query, variables)
        .toPromise()
        .then((r) => {
          if (r.error) throw new Error(r.error.message);
          return queryFn(r.data);
        });
    },
    refetchInterval: ({ state, ...rest }) =>
      // Try refetching if items are empty. Sometimes the indexer takes time to pick up the new data.
      {
        return state.data?.items.length ? 0 : 1000;
      },
  });
}
