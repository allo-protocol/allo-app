"use client";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

import { CreateGrantSchema } from "~/schemas/grant";
import { useIpfsUpload } from "~/hooks/use-ipfs";
import { useAccount } from "wagmi";
import { BalanceCheck } from "./balance-check";
import { useRegister } from "~/hooks/use-register";
import { useRouter } from "next/navigation";

export function CreateGrant() {
  const { address } = useAccount();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateGrantSchema>>({
    resolver: zodResolver(CreateGrantSchema),
    defaultValues: {
      address,
      metadata: {
        title: "Grant Project",
        description: `This is a project...`,
      },
    },
  });
  const register = useRegister();
  const ipfs = useIpfsUpload();

  const isLoading = ipfs.isPending || register.isPending;
  return (
    <Form {...form}>
      <form
        className="relative space-y-2 mx-auto max-w-screen-sm"
        onSubmit={form.handleSubmit(async (values) => {
          const metadata = await ipfs.mutateAsync(values.metadata);
          register.mutate([values.address, metadata, "0x"], {
            onSuccess: () => router.push(`/`),
          });
        })}
      >
        <FormField
          control={form.control}
          name="metadata.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grant name</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="Grant #1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payout address</FormLabel>
              <FormControl>
                <Input autoFocus placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metadata.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={8} placeholder={"..."} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>Markdown is supported</FormDescription>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end">
          <BalanceCheck>
            <Button isLoading={isLoading} type="submit">
              Create Grant
            </Button>
          </BalanceCheck>
        </div>
      </form>
    </Form>
  );
}
