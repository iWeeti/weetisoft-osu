import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string() : z.string().url(),
    ),
    // Add ` on ID and SECRET if you want to make sure they're not empty
    DISCORD_CLIENT_ID: z.string().optional(),
    DISCORD_CLIENT_SECRET: z.string().optional(),
    OSU_CLIENT_ID: z.string(),
    OSU_CLIENT_SECRET: z.string(),
    OSU_API_KEY: z.string(),

    // Redis
    REDIS_URL: z.string().url(),
    GRAFANA_URL: z.string().url(),
    GRAFANA_API_KEY: z.string(),
    GRAFANA_DATASOURCE: z.string(),

    ALGOLIA_ADMIN_KEY: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_POSTHOG_TOKEN: z.string().optional(),
    NEXT_PUBLIC_TIMEZONE_OFFSET: z.string().optional(),
    NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
    NEXT_PUBLIC_ALGOLIA_ENABLED: z.boolean({ coerce: true }).optional(),
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: z.string().optional(),
    NEXT_PUBLIC_DISCORD_SERVER_INVITE: z.string().optional(),
    NEXT_PUBLIC_DISCORD_SERVER_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    OSU_CLIENT_ID: process.env.OSU_CLIENT_ID,
    OSU_CLIENT_SECRET: process.env.OSU_CLIENT_SECRET,
    OSU_API_KEY: process.env.OSU_API_KEY,
    REDIS_URL: process.env.REDIS_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    GRAFANA_URL: process.env.GRAFANA_URL,
    GRAFANA_API_KEY: process.env.GRAFANA_API_KEY,
    GRAFANA_DATASOURCE: process.env.GRAFANA_DATASOURCE,
    NEXT_PUBLIC_POSTHOG_TOKEN: process.env.NEXT_PUBLIC_POSTHOG_TOKEN,
    NEXT_PUBLIC_TIMEZONE_OFFSET: process.env.NEXT_PUBLIC_TIMEZONE_OFFSET,
    NEXT_PUBLIC_ALGOLIA_ENABLED: process.env.NEXT_PUBLIC_ALGOLIA_ENABLED,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
    NEXT_PUBLIC_DISCORD_SERVER_INVITE: process.env.NEXT_PUBLIC_DISCORD_SERVER_INVITE,
    NEXT_PUBLIC_DISCORD_SERVER_ID: process.env.NEXT_PUBLIC_DISCORD_SERVER_ID,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
