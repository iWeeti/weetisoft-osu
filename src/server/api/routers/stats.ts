import axios from "axios";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";

export const statsRouter = createTRPCRouter({
  connected: publicProcedure.query(async ({ ctx }) => {
    const { data } = await axios.post<{
      results: {
        A: {
          status: number;
          frames: {
            schema: {
              refId: string;
              meta: {
                type: string;
                typeVersion: number[];
                custom: {
                  resultType: string;
                };
                executedQueryString: string;
              };
              fields: {
                name: string;
                type: string;
                typeInfo: {
                  frame: string;
                };
                config: {
                  interval: number;
                };
                labels?: {
                  group: string;
                  instance: string;
                  job: string;
                };
              }[];
            };
            data: {
              values: number[][];
            };
          }[];
        };
      };
    }>(
      `${env.GRAFANA_URL}api/ds/query`,
      JSON.stringify({
        queries: [
          {
            datasource: {
              type: "prometheus",
              uid: "a61009fc-c749-4dfc-9df8-b7182e53e12b",
            },
            editorMode: "code",
            expr: "(IsConnected * up)",
            instant: false,
            range: true,
            refId: "A",
            exemplar: false,
            interval: "1d",
            datasourceId: 1,
            // intervalMs: 14 * 24 * 60 * 60 * 1000,
            maxDataPoints: 14,
          },
        ],
        from: (Date.now() - 1000 * 60 * 60 * 24 * 14).toString(),
        to: Date.now().toString(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "osu!autohostrotatewebsite",
          Authorization: `Bearer ${env.GRAFANA_API_KEY}`,
        },
        responseType: "json",
      },
    );

    return data;
  }),
});
