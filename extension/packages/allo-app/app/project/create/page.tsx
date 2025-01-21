"use client";
import { useAccount } from "wagmi";
import { Page } from "~/components/page";
import { useContracts } from "~/hooks/use-contracts";
import { RegistrationForm } from "~/components/registration/registration-form";

export default function ProjectRegisterPage() {
  const { AlloIRL } = useContracts();
  const { address } = useAccount();
  return (
    <Page title="Register Project">
      <RegistrationForm
        strategyAddress={AlloIRL?.address}
        defaultValues={{
          address,
          metadata: {
            title: "Grant Project",
            image: undefined,
            description: `This is a project...`,
          },
        }}
      />
      ;
    </Page>
  );
}
