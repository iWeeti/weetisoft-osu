import { BarChart, BarList, Card, DonutChart, Metric, Text, Title } from "@tremor/react";
import { desc, eq, sql } from "drizzle-orm";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { osuLegacy } from "~/lib/osu";
import { db } from "~/server/db";
import { scores } from "~/server/db/schema";
import { UserTabs } from "./tabs";
import Link from "next/link";
import { getRankName } from "~/lib/rank";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { nameOrId: string } }, parent: ResolvingMetadata): Promise<Metadata> {
  const osuUser = await osuLegacy.getUser({ u: decodeURIComponent(params.nameOrId), m: "osu" });

  if (!osuUser) {
    notFound();
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

  // const metadata = await parent;

  return {
    title: `${osuUser.username}'s Statistics`,
    description: `${unitFormat.format(user.matchesPlayed)} matches played, ${playtimeFormat.format(user.playtime / 3600)} playtime`
  }
}

export default async function ProfilePage({
  params,
}: {
  params: { nameOrId: string };
}) {
  const osuUser = await osuLegacy.getUser({ u: decodeURIComponent(params.nameOrId), m: "osu" });

  if (!osuUser) {
    notFound();
    return;
  }

  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.name, osuUser.username),
  });

  if (!user) {
    notFound();
  }

  const rankCounts = await db.select({
    count: sql<number>`count(${scores.userId})`,
    rank: scores.rank
  }).from(scores).groupBy(scores.rank).where(eq(scores.userId, user.id));

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
      <Link href={`https://osu.ppy.sh/users/${osuUser.user_id}`} className="flex items-center gap-5">
        <Image
          src={`https://a.ppy.sh/${osuUser.user_id}?.png`}
          width={64}
          height={64}
          alt={osuUser.username}
        />
        <h1 className="text-2xl font-bold tracking-tight">{osuUser.username}</h1>
      </Link>
      <hr className="my-5" />
      <div className="flex items-center gap-5 max-md:flex-col max-md:items-stretch">
        <Card className="h-24 md:w-1/3" decoration="left">
          <Text>
            Playtime
          </Text>
          <Metric>
            {playtimeFormat.format(user.playtime / 3600)}
          </Metric>
        </Card>
        <Card className="h-24 md:w-1/3" decoration="left">
          <Text>
            Matches Played
          </Text>
          <Metric>
            {unitFormat.format(user.matchesPlayed)}
          </Metric>
        </Card>
        <Card className="h-24 md:w-1/3" decoration="left">
          <Text>
            Number 1 Results
          </Text>
          <Metric>
            {unitFormat.format(user.numberOneResults)}
            <span className="ml-2 text-lg text-muted-foreground">
              (
              {percentageFormat.format(
                user.numberOneResults / user.matchesPlayed,
              )}
              )
            </span>
          </Metric>
        </Card>
      </div>
      <hr className="my-5" />
      <Card decoration="left" className="space-y-2">
        <Title>
          Rank Distribution
        </Title>
        <BarList
          data={rankCounts.sort((a, b) => a.rank - b.rank).map((d) => ({
            name: getRankName(d.rank as any),
            value: d.count
          }))} 
          // index="name"
          // category="count"
          // colors={["gray", "red", "yellow", "green", "blue", "yellow", "sky"]}
        />
      </Card>
      <hr className="my-5" />
      <UserTabs userId={user.id} />
    </div>
  );
}
