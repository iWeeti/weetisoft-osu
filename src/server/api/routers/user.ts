import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { scores } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  stats: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.name, ctx.session.user.name!),
    });

    return user;
  }),
  search: publicProcedure.input(z.object({
    username: z.string()
  })).query(async ({ctx, input}) => {
    const {username} = input;

    const results = await ctx.db.query.users.findMany({
      where: (u, {eq}) => eq(u.name, `${username}`),
    })

    return results;
  }),
  top5Scores: publicProcedure.input(z.object({
    userId: z.number().int(),
    limit: z.number().nullish(),
  })).query(async ({ctx, input}) => {

  const user = await ctx.db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, input.userId),
    with: {
      scores: {
        orderBy: desc(scores.totalScore),
        limit: input.limit ?? 5,
        with: {
          beatmap: true
        }
      },
    }
  });

  if (!user) {
    throw new TRPCError({
      code:"NOT_FOUND"
    })
  }

  return (user.scores);


  }),
  recentScores: publicProcedure.input(z.object({
    userId: z.number().int(),
    limit: z.number().nullish(),
  })).query(async ({ctx, input}) => {

  const user = await ctx.db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, input.userId),
    with: {
      scores: {
        orderBy: desc(scores.time),
        limit: input.limit ?? 5,
        with: {
          beatmap: true
        }
      },
    }
  });

  if (!user) {
    throw new TRPCError({
      code:"NOT_FOUND"
    })
  }

  return (user.scores);


  })
});
