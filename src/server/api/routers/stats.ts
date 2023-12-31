import axios from "axios";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";

export const statsRouter = createTRPCRouter({
  connected: publicProcedure.query(async ({ ctx }) => {
    const { data } = await axios.post<{
      results: Record<
        string,
        {
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
        }
      >;
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
            refId: "connected",
            interval: "12h",
            datasourceId: 1,
            // intervalMs: 60 * 60 * 1000,
            maxDataPoints: 1,
          },
          {
            datasource: {
              type: "prometheus",
              uid: "a61009fc-c749-4dfc-9df8-b7182e53e12b",
            },
            editorMode: "code",
            expr: "avg_over_time((sum((up AND IsConnected) OR on() vector(1)))[30d:1m]) * 100",
            instant: false,
            range: true,
            refId: "A",
            interval: "1h",
            datasourceId: 1,
            // intervalMs: 60 * 60 * 1000,
            maxDataPoints: 12,
          },
        ],
        from: "now-12h",
        to: "now",
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
