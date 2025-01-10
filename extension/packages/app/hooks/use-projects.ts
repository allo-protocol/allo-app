"use client";

import { Address } from "viem";
import { useIndexer, Variables } from "./use-indexer";
import { PROJECTS_SCHEMA } from "~/queries";

export type Project = {
  address: Address;
  metadata: {
    title: string;
    image: string;
    description: string;
  };
  allocations?: { items: Allocation[] };
  isApproved: boolean;
};

export type Allocation = {
  id: string;
  amount: number;
  from: Address;
  token: { symbol: string };
  createdAt: number;
};

export function useProjects(variables: Variables) {
  return useIndexer<Project>({
    queryKey: ["projects", variables],
    variables,
    query: PROJECTS_SCHEMA,
    queryFn: async (r) => r?.projects,
  });
}

export function useProjectById(address: Address) {
  const { data, ...rest } = useProjects({ where: { address_in: [address] } });
  return { ...rest, data: data?.items?.[0] };
}
