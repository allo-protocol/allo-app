"use client";

import { useQuery } from "@tanstack/react-query";
import { generatePrivateKey, privateKeyToAddress } from "viem/accounts";

export type Grant = {
  address: string;
  name: string;
};

const grants = Array.from({ length: 12 })
  .fill(0)
  .map((_, i) => ({
    name: `Grant #${i + 1}`,
    address: privateKeyToAddress(generatePrivateKey()),
  }));

type QueryFilter = {
  first?: number;
  skip?: number;
  where?: {};
};
export function useGrants(query: QueryFilter) {
  const { first = 12, skip = 0 } = query;
  return useQuery({
    queryKey: ["grants", query],
    queryFn: async () => grants.slice(skip, first + skip),
  });
}
