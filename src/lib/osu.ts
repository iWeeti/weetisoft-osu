import { Client, LegacyClient } from "osu-web.js";
import { env } from "~/env.mjs";

// Client for the current API (API v2)
export function getOsuClient(oauthAccessToken: string) {
  return new Client(oauthAccessToken);
}
// Client for the legacy API (API v1)
export const osuLegacy = new LegacyClient(env.OSU_API_KEY);
