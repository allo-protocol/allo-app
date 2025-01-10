import { createConfig } from "ponder";
import { http } from "viem";
import deployedContracts from "@se-2/nextjs/contracts/deployedContracts";
import scaffoldConfig from "@se-2/nextjs/scaffold.config";

const targetNetwork = scaffoldConfig.targetNetworks[0];

const networks = {
  [targetNetwork.name]: {
    chainId: targetNetwork.id,
    transport: http(process.env[`PONDER_RPC_URL_${targetNetwork.id}`]),
  },
};

const { Allocator, Strategy, Registry } = deployedContracts[targetNetwork.id];

export default createConfig({
  networks: networks,
  contracts: {
    Allocator: {
      network: targetNetwork.name,
      abi: Allocator.abi,
      startBlock: 0,
    },
    Strategy: {
      network: targetNetwork.name,
      abi: Strategy.abi,
      startBlock: 0,
    },
    Registry: {
      network: targetNetwork.name,
      abi: Registry.abi,
      startBlock: 0,
    },
  },
});
