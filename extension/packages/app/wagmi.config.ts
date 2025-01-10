import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import deployedContracts from "../nextjs/contracts/deployedContracts";
import { Abi } from "viem";

const contracts = Object.entries<{ abi: Abi }>(deployedContracts["31337"]).map(
  ([name, { abi }]) => {
    return {
      name: name === "YourContract" ? "Strategy" : name,
      abi,
    };
  }
);

export default defineConfig({
  out: "generated/wagmi.ts",
  contracts,
  plugins: [react()],
});
