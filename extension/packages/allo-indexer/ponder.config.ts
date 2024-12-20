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

const { YourContract } = deployedContracts[targetNetwork.id];

export default createConfig({
  networks: networks,
  contracts: {
    YourContract: {
      network: targetNetwork.name,
      abi: YourContract.abi,
      address: YourContract.address,
      startBlock: YourContract.startBlock || 0,
    },
  },
});
