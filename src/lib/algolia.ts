import algoliasearch from "algoliasearch";
import { env } from "~/env.mjs";

export const getAlgoliaAdminClient = () => {
  if (
    !env.NEXT_PUBLIC_ALGOLIA_ENABLED ||
    !env.NEXT_PUBLIC_ALGOLIA_APP_ID ||
    !env.ALGOLIA_ADMIN_KEY
  ) {
    throw new Error("Algolia is not configured");
  }
  return algoliasearch(env.NEXT_PUBLIC_ALGOLIA_APP_ID, env.ALGOLIA_ADMIN_KEY);
};
