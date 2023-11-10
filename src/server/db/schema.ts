import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "@auth/core/adapters";

export const games = sqliteTable("Games", {
  id: integer("Id").notNull().primaryKey({ autoIncrement: true }),
  beatmapId: integer("BeatmapId").notNull(),
  playerCount: integer("PlayerCount").notNull(),
  playerFinishCount: integer("PlayerFinishCount").notNull(),
  playerPassedCount: integer("PlayerPassedCount").notNull(),
  time: text("Time").notNull(),
});

export const mapBans = sqliteTable("MapBans", {
  id: integer("Id").notNull().primaryKey({ autoIncrement: true }),
  beatmapSetId: integer("BeatmapSetId"),
  beatmapId: integer("BeatmapId"),
});

export const playerBans = sqliteTable("PlayerBans", {
  id: integer("Id").notNull().primaryKey({ autoIncrement: true }),
  active: integer("Active", { mode: "boolean" }).notNull(),
  userId: integer("UserId")
    .notNull()
    .references(() => users.userId, {
      onDelete: "cascade",
      onUpdate: "no action",
    }),
  reason: text("Reason"),
  time: text("Time").notNull(),
  expire: text("Expire"),
  hostBan: integer("HostBan", { mode: "boolean" }).notNull(),
});

export const playerBansRelations = relations(playerBans, ({ one }) => ({
  user: one(users, {
    fields: [playerBans.userId],
    references: [users.userId],
  }),
}));

export const users = sqliteTable("Users", {
  id: text("Id").notNull().primaryKey(),
  userId: integer("UserId"),
  name: text("Name").notNull(),
  playtime: integer("Playtime").notNull(),
  matchesPlayed: integer("MatchesPlayed").notNull(),
  numberOneResults: integer("NumberOneResults").notNull(),
  administrator: integer("Administrator", { mode: "boolean" })
    .notNull()
    .default(false),
  autoSkipEnabled: integer("AutoSkipEnabled", { mode: "boolean" })
    .notNull()
    .default(false),
});

export const usersRelations = relations(users, ({ many }) => ({
  playerBans: many(playerBans),
}));

export const websiteUsers = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email"),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => websiteUsers.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  }),
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => websiteUsers.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

export const __efMigrationsHistory = sqliteTable(
  "__EFMigrationsHistory",
  {
    migrationId: text("MigrationId").notNull(),
    productVersion: text("ProductVersion").notNull(),
  },
  (m) => ({
    primary: primaryKey(m.migrationId),
  }),
);
