"use client";
import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "./ui/button";
import { UserIcon } from "lucide-react";
import { useAccount } from "wagmi";

export function ConnectButton() {
  const { isConnecting } = useAccount();
  return (
    <RainbowKitConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const connected = mounted && account && chain;

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (connected) {
                return (
                  <Button
                    variant="outline"
                    size="icon"
                    icon={UserIcon}
                    onClick={openAccountModal}
                    className="overflow-hidden rounded-full"
                  />
                );
              }
              if (chain?.unsupported) {
                return (
                  <Button
                    variant="secondary"
                    onClick={openChainModal}
                    type="button"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <Button
                  disabled={isConnecting}
                  onClick={openConnectModal}
                  variant="secondary"
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              );
            })()}
          </div>
        );
      }}
    </RainbowKitConnectButton.Custom>
  );
}
