import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  primaryKey,
  real,
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
  id: integer("Id").notNull().primaryKey(),
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
  scores: many(scores),
}));

export const maps = sqliteTable("Maps", {
  id: integer("Id", {
    mode: "number"
  }).notNull().primaryKey({
    autoIncrement: true,
  }),
  beatmapId: integer("BeatmapId").notNull(),
  beatmapSetId: integer("BeatmapSetId").notNull(),
  beatmapName: text("BeatmapName").notNull(),
  beatmapArtist: text("BeatmapArtist").notNull(),
  difficultyName: text("DifficultyName").notNull(),
  starRating: real("StarRating"),
  timesPlayed: integer("TimesPlayed").notNull(),
  averagePassPercentage: real("AveragePassPercentage"),
  averageLeavePercentage: real("AverageLeavePercentage"),
  lastPlayed: text("LastPlayed").notNull(),
});

export const mapsRelations = relations(maps, ({one, many}) => ({
  scores: many(scores)
}))

export const scores = sqliteTable("Scores", {
  id: integer("Id").notNull().primaryKey({
    autoIncrement: true,
  }),
  userId: integer("UserId").notNull().references(() => users.id),
  gameId: integer("gameId").notNull(),
  playerId: integer("PlayerId"),
  lobbyId: integer("LobbyId").notNull(),
  osuScoreId: integer("OsuScoreId"),
  beatmapId: integer("BeatmapId").notNull().references(() => maps.beatmapId),
  totalScore: integer("TotalScore").notNull(),
  rank: integer("Rank").notNull(),
  maxCombo: integer("MaxCombo").notNull(),
  count300: integer("Count300").notNull(),
  count100: integer("Count100").notNull(),
  count50: integer("Count50").notNull(),
  countMiss: integer("CountMiss").notNull(),
  mods: integer("Mods").notNull(),
  time: text("Time").notNull(),
});

export const scoresRelations = relations(scores, ({one}) => ({
  user: one(users, {
    fields: [scores.userId],
    references: [users.id]
  }),
  beatmap: one(maps, {
    fields: [scores.beatmapId],
    references: [maps.beatmapId]
  })
}))

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
