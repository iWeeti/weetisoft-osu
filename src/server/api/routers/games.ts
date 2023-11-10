import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { osuLegacy } from "~/lib/osu";
import { TRPCError } from "@trpc/server";
import { getRedis } from "~/lib/redis";
import { type LegacyBeatmap } from "osu-web.js";

export const gamesRouter = createTRPCRouter({
  getBeatmap: publicProcedure
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const redis = await getRedis();

      let map: LegacyBeatmap | undefined;
      const cached = await redis.get(`osu:beatmap:${input.id}`);
      if (!cached) {
        const [fresh] = await osuLegacy.getBeatmaps({
          type: "id",
          b: input.id,
          m: "osu",
          limit: 1,
        });

        map = fresh;

        await redis.set(`osu:beatmap:${input.id}`, JSON.stringify(map), {
          EX: 60 * 60,
        });
      } else {
        const parsed = JSON.parse(cached) as unknown;

        if (parsed) {
          map = parsed as LegacyBeatmap;
        }
      }

      if (!map) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return map;
    }),
});
