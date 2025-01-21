import { Context, Event, ponder } from "ponder:registry";
import schemas from "ponder:schema";
import { Address, erc20Abi, Hex } from "viem";
import pRetry, { AbortError } from "p-retry";

const PINATA_GATEWAY_URL = process.env.PINATA_GATEWAY_URL;
const PINATA_GATEWAY_KEY = process.env.PINATA_GATEWAY_KEY;

const MAX_RETRY_COUNT = 5;

ponder.on("Strategy:Initialize", async ({ event, context }) => {
  const { strategyName } = event.args;

  await context.db
    .insert(schemas.strategy)
    .values({
      address: event.log.address,
      name: strategyName,
      createdAt: toSeconds(Date.now()),
    })
    .onConflictDoNothing();
});

ponder.on("Registry:Register", async ({ event, context }) => {
  const { index, project, metadataURI, data } = event.args;
  const metadata = await fetchMetadata(metadataURI);

  await context.db
    .insert(schemas.registration)
    .values({
      id: registrationId(event),
      index,
      address: project,
      strategy: event.log.address,
      metadataURI,
      metadata,
      isApproved: false,
      data,
      createdAt: toSeconds(Date.now()),
      updatedAt: toSeconds(Date.now()),
    })
    .onConflictDoNothing();
});

ponder.on("Registry:Approve", async ({ event, context }) => {
  const review = await fetchMetadata(event.args.metadataURI);

  await context.db
    .update(schemas.registration, { id: registrationId(event) })
    .set(() => ({
      isApproved: true,
      updatedAt: toSeconds(Date.now()),
      review,
    }));
});

ponder.on("Allocator:Allocate", async ({ event, context }) => {
  const { to, from, token, amount } = event.args;

  const [decimals, symbol] = await fetchToken(token, context.client);

  await context.db.insert(schemas.allocation).values({
    id: `${event.log.id}`,
    strategy: event.log.address,
    to,
    from,
    amount: amount.toString(),
    token: { address: token, decimals, symbol },
    tokenAddress: token,
    createdAt: toSeconds(Date.now()),
  });
});

// Registration IDs are a composite of project address, strategy, and applicationIndex
const registrationId = (event: Event) =>
  `${event.args.project}_${event.log.address}_${event.args.index}` as Hex;

async function fetchMetadata(cid: string) {
  return pRetry(
    () => {
      const ipfsUrl = `https://${PINATA_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${PINATA_GATEWAY_KEY}`;
      return cid
        ? fetch(ipfsUrl)
            .then(async (r) => {
              if (r.status === 404) {
                throw new AbortError(r.statusText);
              }
              return (await r.json()) as {
                title: string;
                description?: string;
                image?: string;
              };
            })
            .catch((err) => ({}))
        : {};
    },
    { retries: MAX_RETRY_COUNT }
  );
}

async function fetchToken(address: Address, client: Context["client"]) {
  // TODO: Add cache
  return pRetry(
    () => {
      const tokenContract = {
        abi: erc20Abi,
        address,
        cache: "immutable",
      } as const;
      return Promise.all([
        client.readContract({ ...tokenContract, functionName: "decimals" }),
        client.readContract({ ...tokenContract, functionName: "symbol" }),
      ]);
    },
    { retries: MAX_RETRY_COUNT }
  );
}

function toSeconds(ms: number) {
  return Math.floor(ms / 1000);
}
