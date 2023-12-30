import { desc } from "drizzle-orm";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BaseLayout } from "~/components/layouts/base";
import { Separator } from "~/components/ui/separator";
import { osuLegacy } from "~/lib/osu";
import { db } from "~/server/db";
import { scores } from "~/server/db/schema";

export const revalidate = 60;

export default async function ProfilePage({
  params,
}: {
  params: { nameOrId: string };
}) {
  const osuUser = await osuLegacy.getUser({ u: params.nameOrId, m: "osu" });

  if (!osuUser) {
    notFound();
    return;
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.name, osuUser.username),
    with: {
      scores: {
        orderBy: desc(scores.totalScore),
        limit: 5,
        with: {
          beatmap: true
        }
      },
    }
  });

  if (!user) {
    notFound();
  }

  const playtimeFormat = new Intl.NumberFormat("en-US", {
    style: "unit",
    unit: "hour",
    unitDisplay: "long",
    maximumFractionDigits: 1,
  });

  const unitFormat = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
  });

  const percentageFormat = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  });

  const timeFormat = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  const relativeFormat = new Intl.RelativeTimeFormat("en-US", {
    style: "long",
  });

  return (
    <div>
      <Image
        src={`https://a.ppy.sh/${osuUser.user_id}?.png`}
        width={64}
        height={64}
        alt={osuUser.username}
      />
      <h1>{osuUser.username}</h1>
      <hr className="my-5" />
      <div className="flex items-center gap-5 max-md:flex-col max-md:items-stretch">
        <div className="h-24 w-1/3 space-y-1 rounded-sm bg-secondary p-3">
          <p className="text-sm text-muted-foreground">Playtime</p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {playtimeFormat.format(user.playtime / 3600)}
          </p>
        </div>
        <div className="h-24 w-1/3 space-y-1 rounded-sm bg-secondary p-3">
          <p className="text-sm text-muted-foreground">Matches Played</p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {unitFormat.format(user.matchesPlayed)}
          </p>
        </div>
        <div className="h-24 w-1/3 space-y-1 rounded-sm bg-secondary p-3">
          <p className="text-sm text-muted-foreground">Number 1 Results</p>
          <p className="text-4xl font-bold tracking-tight text-foreground">
            {unitFormat.format(user.numberOneResults)}
            <span className="ml-2 text-lg text-muted-foreground">
              (
              {percentageFormat.format(
                user.numberOneResults / user.matchesPlayed,
              )}
              )
            </span>
          </p>
        </div>
      </div>
      <hr className="my-5" />
      <h3>Top 5 Scores</h3>
      <ul className="space-y-5 my-5">

        {user.scores.map((score) => {
          const { beatmap } = score;

          return (
            <li
              className="flex h-64 rounded-sm border p-3 shadow"
              style={{
                backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmap?.beatmapSetId}/covers/cover@2x.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backgroundBlendMode: "darken",
              }}
              key={score.id}
            >
              <div className="flex flex-col">
                <Link
                  href={`https://osu.ppy.sh/b/${beatmap?.beatmapId}#osu/${beatmap?.beatmapSetId}`}
                  target={"_blank"}
                  className="flex-none hover:underline"
                >
                  {beatmap?.beatmapName ?? "Unable to load"}
                </Link>
                <time className="flex-none text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "medium",
                  }).format(new Date(score.time))}
                  {" • "}
                  {new Intl.RelativeTimeFormat("en-US", {
                    numeric: "auto",
                  }).format(
                    Math.floor(
                      (new Date(score.time).getTime() - Date.now()) / 1000 / 60 / 60,
                    ),
                    "hour",
                  )}
                </time>
                <div className="flex-1"></div>
                <div className="flex flex-none items-center gap-2">
                  <p className="text-lg">
                    {unitFormat.format(score.totalScore)}
                  </p>
                  <div className="h-4 w-px border border-muted-foreground"></div>
                  <p className="text-lg text-muted-foreground">{unitFormat.format(score.maxCombo)}x</p>

                  <div className="h-4 w-px border border-muted-foreground"></div>
                  <p className="text-lg text-muted-foreground">Placed #{unitFormat.format(score.rank)} in the lobby</p>
                </div>
              </div>
              <div className="ml-auto flex flex-col">
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <p>
                    {unitFormat.format(score.count300)}
                  </p>
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
          )
        })}
      </ul>
    </div>
  );
}
