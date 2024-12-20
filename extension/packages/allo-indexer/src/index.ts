import { Context, ponder } from "ponder:registry";
import schema from "ponder:schema";
import { Address, erc20Abi, formatUnits } from "viem";

const PINATA_GATEWAY_URL = process.env.PINATA_GATEWAY_URL;
const PINATA_GATEWAY_KEY = process.env.PINATA_GATEWAY_KEY;

ponder.on("YourContract:Register", async ({ event, context }) => {
  const { project, metadataURI } = event.args;

  const metadata = await fetchMetadata(metadataURI);
  await context.db
    .insert(schema.project)
    .values({
      address: project,
      metadataURI,
      metadata,
      isApproved: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoNothing();
});

ponder.on("YourContract:Approve", async ({ event, context }) => {
  const { project, metadataURI } = event.args;

  const review = await fetchMetadata(metadataURI);
  await context.db.update(schema.project, { address: project }).set(() => ({
    isApproved: true,
    updatedAt: new Date(),
    review,
  }));
});

ponder.on("YourContract:Allocate", async ({ event, context }) => {
  const { recipient, from, token, amount } = event.args;
  console.log(event);
  const [decimals, symbol] = await fetchToken(token, context.client);

  await context.db
    .insert(schema.allocation)
    .values({
      hash: event.transaction.hash,
      recipient,
      from,
      amount: Number(formatUnits(amount, decimals)),
      token: { address: token, decimals, symbol },
      tokenAddress: token,
      createdAt: new Date(),
    })
    .onConflictDoNothing();

  // await context.db
  // .insert(schema.projectAllocation)
  // .values({ projectAddress, recipientAddress: recipient })
  // .onConflictDoNothing();
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
