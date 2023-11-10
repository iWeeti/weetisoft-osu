import Image from "next/image";
import { notFound } from "next/navigation";
import { BaseLayout } from "~/components/layouts/base";
import { Separator } from "~/components/ui/separator";
import { osuLegacy } from "~/lib/osu";
import { db } from "~/server/db";

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
    </div>
  );
}
