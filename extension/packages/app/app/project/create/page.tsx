"use client";
import { Page } from "~/components/page";
import { ProjectRegister } from "~/components/project-register";
import { useContracts } from "~/hooks/use-contracts";

export default function ProjectRegisterPage() {
  const { SimpleGrants } = useContracts();
  return (
    <Page title="Register Project">
      <ProjectRegister strategyAddress={SimpleGrants?.address} />;
    </Page>
  );
}
