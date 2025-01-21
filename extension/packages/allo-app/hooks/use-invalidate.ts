import { useQueryClient } from "@tanstack/react-query";

export function useInvalidate() {
  const queryClient = useQueryClient();

  return (queryKey: unknown[]) => {
    // Timeout to let indexer catch up (what could be better solutions?)
    setTimeout(() => queryClient.invalidateQueries({ queryKey }), 1000);
  };
}
