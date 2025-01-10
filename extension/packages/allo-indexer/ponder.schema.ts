import { onchainTable, relations } from "ponder";

export const strategy = onchainTable("strategy", (t) => ({
  address: t.hex().primaryKey(),
  name: t.text().notNull(),
  createdAt: t.integer().notNull(),
}));

export const project = onchainTable("project", (t) => ({
  address: t.hex().primaryKey(),
  strategy: t.hex().notNull(),
  metadataURI: t.text().notNull(),
  metadata: t.json(),
  review: t.json(),
  isApproved: t.boolean().notNull(),
  createdAt: t.integer().notNull(),
  updatedAt: t.integer().notNull(),
}));

export const allocation = onchainTable("allocation", (t) => ({
  id: t.text().primaryKey(),
  strategy: t.hex().notNull(),
  recipient: t.hex().notNull(),
  from: t.hex().notNull(),
  amount: t.integer().notNull(),
  tokenAddress: t.hex().notNull(),
  token: t.json(),
  createdAt: t.integer().notNull(),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  strategy: one(strategy, {
    fields: [project.strategy],
    references: [strategy.address],
  }),
  allocations: many(allocation),
}));

export const allocationRelations = relations(allocation, ({ one }) => ({
  project: one(project, {
    fields: [allocation.recipient],
    references: [project.address],
  }),
}));
