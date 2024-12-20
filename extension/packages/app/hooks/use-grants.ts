"use client";
import { useIndexer, Variables } from "./use-indexer";
import { PROJECTS_SCHEMA } from "~/queries";

export type Grant = {
  address: string;
  metadata: {
    title: string;
  };
};

export function useGrants(variables: Variables) {
  console.log("vars", variables);
  return useIndexer<Grant>({
    queryKey: ["grants", variables],
    variables,
    query: PROJECTS_SCHEMA,
    queryFn: async (r) => {
      console.log(r);
      return r.projects;
    },
  });
}
