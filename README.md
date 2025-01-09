# Allo App Extension for Scaffold-ETH 2

Allo App gets you up and running building Allocation Strategies in no time!

## Installation

`npx create-eth@latest -e allocapital/allo-kit`

## Getting Started

```sh
yarn chain          # Run hardhat node
yarn deploy         # Deploy contracts
yarn allo:indexer   # Run indexer
yarn allo:dev       # Run app

open localhost:3000
```

Make sure Ponder schema has been generated. Regenerate by navigating to `packages/allo-indexer` and run `npm run codegen`.
