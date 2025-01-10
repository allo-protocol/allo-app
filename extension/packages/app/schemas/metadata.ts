import { z } from "zod";

export const MetadataSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;
