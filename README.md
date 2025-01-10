# Allo Kit Extension for Scaffold-ETH 2

Allo Kit gets you up and running building Allocation Strategies in no time!

## Installation

`npx create-eth@latest -e allocapital/allo-kit`

## Getting Started

### Update .env variables

Create `.env.local` files for both the allo app and the indexer.

```sh
cp packages/app/.env.sample packages/app/.env.local
cp packages/allo-indexer/.env.sample packages/allo-indexer/.env.local
```

Update the Pinata variables. This is needed for the creation and fetching of metadata to work properly.

```sh
PINATA_GATEWAY_KEY=
PINATA_JWT=
PINATA_GATEWAY_URL=
```

### Development

```sh
yarn chain          # Run hardhat node
yarn deploy         # Deploy contracts
yarn allo:indexer   # Run indexer
yarn allo:dev       # Run app

open localhost:3000
```

Make sure Ponder schema has been generated. Regenerate by navigating to `packages/allo-indexer` and run `npm run codegen`.
