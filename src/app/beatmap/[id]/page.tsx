import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { env } from "~/env.mjs";
import { getModsFromBitwise } from "~/lib/mods";
import { getRankName } from "~/lib/rank";
import { db } from "~/server/db";
import { scores } from "~/server/db/schema";

dayjs.extend(RelativeTime);

export const revalidate = 0;

export default async function BeatmapPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const beatmapId = parseInt(params.id);

  if (Number.isNaN(beatmapId)) {
    notFound();
  }
  const beatmap = await db.query.maps.findFirst({
    where: (m, { eq }) => eq(m.beatmapId, beatmapId),
    with: {
      scores: {
        orderBy: desc(scores.totalScore),
        limit: 10,
        with: {
          user: true,
        },
      },
    },
  });

  if (!beatmap) {
    notFound();
  }

  const unitFormat = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  });

  return (
    <div className="space-y-5">
      <div
        className="-mt-10 p-5 h-64 flex items-end"
        style={{
          backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmap.beatmapSetId}/covers/cover.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "darken",
          backgroundColor: "rgba(0,0,0,0.75)",
        }}
      >
        <div className="flex flex-col items-start ">
          <Link
            href={`https://osu.ppy.sh/b/${beatmap.beatmapId}`}
            target="_blank"
            className="text-2xl font-bold tracking-tight"
          >
            {beatmap?.beatmapName}
          </Link>
          <Link
            href={`https://osu.ppy.sh/beatmapsets?q=artist%3D%22${beatmap.beatmapArtist}%22`}
            target="_blank"
            className="text muted-foreground"
          >
            {beatmap.beatmapArtist}
          </Link>
        </div>
      </div>
      <hr className="my-5" />
      <h3>Top Scores</h3>
      <ul className="space-y-5">
        {beatmap.scores.map((score) => {
          const timestamp = dayjs(
            `${score.time}${env.NEXT_PUBLIC_TIMEZONE_OFFSET ?? "+1"}`,
          )
            .toDate()
            .toLocaleString();
          const relative = dayjs(
            `${score.time}${env.NEXT_PUBLIC_TIMEZONE_OFFSET ?? "+1"}`,
          ).fromNow();

          return (
            <li
              className="flex h-32 rounded-sm border p-3 shadow gap-5"
              key={score.id}
            >
              <div className="flex flex-col w-full flex-1">
                <Link
                  href={`/user/${score?.user.name}`}
                  target={"_blank"}
                  className="flex-none hover:underline text-white"
                >
                  {score.user.name}
                </Link>
                <time className="flex-none text-sm text-muted-foreground">
                  {timestamp} • {relative}
                </time>
                <div className="flex-1"></div>
                <div className="flex flex-none items-center gap-2">
                  <p className="text-lg text-white">
                    {unitFormat.format(score.totalScore)}
                  </p>
                  <div className="h-4 w-px border border-muted-foreground"></div>
                  <p className="text-lg text-muted-foreground">
                    {unitFormat.format(score.maxCombo)}x
                  </p>

                  <div className="h-4 w-px border border-muted-foreground"></div>
                  <p className="text-lg text-muted-foreground">
                    {getRankName(score.rank as any)}
                  </p>
                </div>
              </div>
              {score.mods !== 0 && (
                <div className="flex-none">
                  <p className="text-muted-foreground text-sm">Mods</p>
                  <p>{getModsFromBitwise(score.mods).map((mod) => mod)}</p>
                </div>
              )}
              <div className="flex-none ml-auto hidden md:flex flex-col">
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p>{unitFormat.format(score.count300)}</p>
                  <p>
                    x <span className="text-blue-500">300</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {unitFormat.format(score.count100)}
                  </p>
                  <p>
                    x <span className="text-green-500">100</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {unitFormat.format(score.count50)}
                  </p>
                  <p>
                    x <span className="text-orange-500">50</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {unitFormat.format(score.countMiss)}
                  </p>
                  <p>
                    x <span className="text-gray-500">miss</span>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
