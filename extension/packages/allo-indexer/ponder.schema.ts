import { index, onchainTable, primaryKey, relations } from "ponder";

export const project = onchainTable("project", (t) => ({
  address: t.hex().primaryKey(),
  metadataURI: t.text().notNull(),
  metadata: t.json(),
  review: t.json(),
  isApproved: t.boolean().notNull(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}));

export const allocation = onchainTable("allocation", (t) => ({
  hash: t.hex().primaryKey(),
  recipient: t.hex().notNull(),
  from: t.hex().notNull(),
  amount: t.integer().notNull(),
  tokenAddress: t.hex().notNull(),
  token: t.json(),
  createdAt: t.timestamp().notNull(),
}));

export const projectRelations = relations(project, ({ many }) => ({
  allocations: many(allocation),
}));

export const allocationRelations = relations(allocation, ({ one }) => ({
  project: one(project, {
    fields: [allocation.recipient],
    references: [project.address],
  }),
}));
