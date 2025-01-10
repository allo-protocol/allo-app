import { Context, ponder } from "ponder:registry";
import schemas from "ponder:schema";
import { Address, erc20Abi, formatUnits } from "viem";

const PINATA_GATEWAY_URL = process.env.PINATA_GATEWAY_URL;
const PINATA_GATEWAY_KEY = process.env.PINATA_GATEWAY_KEY;

ponder.on("Strategy:Initialize", async ({ event, context }) => {
  const {  strategyName } = event.args;

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
  const { project, metadataURI } = event.args;

  const metadata = await fetchMetadata(metadataURI);
  
  await context.db
    .insert(schemas.project)
    .values({
      address: project,
      strategy: event.log.address,
      metadataURI,
      metadata,
      isApproved: false,
      createdAt: toSeconds(Date.now()),
      updatedAt: toSeconds(Date.now()),
    })
    .onConflictDoNothing();
});

ponder.on("Registry:Approve", async ({ event, context }) => {
  const { project, metadataURI } = event.args;

  const review = await fetchMetadata(metadataURI);

  await context.db.update(schemas.project, { address: project }).set(() => ({
    isApproved: true,
    updatedAt: toSeconds(Date.now()),
    review,
  }));
});

ponder.on("Allocator:Allocate", async ({ event, context }) => {
  const { recipient, from, token, amount } = event.args;
  
  const [decimals, symbol] = await fetchToken(token, context.client);

  await context.db.insert(schemas.allocation).values({
    id: `${event.log.id}`,
    strategy: event.log.address,
    recipient,
    from,
    amount: Number(formatUnits(amount, decimals)),
    token: { address: token, decimals, symbol },
    tokenAddress: token,
    createdAt: toSeconds(Date.now()),
  });
});

async function fetchMetadata(cid: string) {
  const ipfsUrl = `https://${PINATA_GATEWAY_URL}/ipfs/${cid}?pinataGatewayToken=${PINATA_GATEWAY_KEY}`;
  return cid
    ? await fetch(ipfsUrl)
        .then((r) => r.json())
        .catch(() => ({}))
    : {};
}

async function fetchToken(address: Address, client: Context["client"]) {
  const tokenContract = { abi: erc20Abi, address, cache: "immutable" } as const;
  return Promise.all([
    client.readContract({ ...tokenContract, functionName: "decimals" }),
    client.readContract({ ...tokenContract, functionName: "symbol" }),
  ]);
}


function toSeconds(ms: number) {
  return Math.floor(ms / 1000)
}