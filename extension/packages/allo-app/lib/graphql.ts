import { Client, cacheExchange, fetchExchange } from "urql";

const urls = {
  [31337]:
    process.env.NEXT_PUBLIC_INDEXER_URL_31337 || "http://localhost:42069",
};
export function createClient(chainId: number) {
  const url = urls[chainId as keyof typeof urls];
  if (!url) return;

  return new Client({ url, exchanges: [cacheExchange, fetchExchange] });
}
