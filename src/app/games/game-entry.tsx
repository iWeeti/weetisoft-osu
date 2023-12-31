"use client";

import { StarIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { type games } from "~/server/db/schema";
import { trpc } from "~/utils/api";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import { env } from "~/env.mjs";
dayjs.extend(RelativeTime);

export function GameEntry({ game }: { game: typeof games.$inferSelect }) {
  const [relativeTime, setRelativeTime] = useState<string | undefined>();
  const [gameTime, setGameTime] = useState<string | undefined>();
  const { data: beatmap, isLoading: isLoadingBeatmap } =
    trpc.games.getBeatmap.useQuery({
      id: game.beatmapId,
    });

  useEffect(() => {
    setRelativeTime(
      dayjs(`${game.time}${env.NEXT_PUBLIC_TIMEZONE_OFFSET ?? "+1"}`).fromNow(),
    );
    setGameTime(
      dayjs(`${game.time}${env.NEXT_PUBLIC_TIMEZONE_OFFSET ?? "+1"}`)
        .toDate()
        .toLocaleString(),
    );
  }, []);

  if (isLoadingBeatmap) {
    return <GameEntrySkeleton />;
  }

  if (!beatmap) {
    return null;
  }

  return (
    <li
      className="flex h-64 rounded-sm border p-3 shadow"
      style={{
        backgroundImage: `url(https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover@2x.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backgroundBlendMode: "darken",
      }}
    >
      <div className="flex flex-col">
        <Link
          href={`/beatmap/${beatmap.beatmap_id}#osu/${beatmap.beatmapset_id}`}
          target={"_blank"}
          className="flex-none hover:underline"
        >
          {beatmap.title}
        </Link>
        <time className="flex-none text-sm text-muted-foreground">
          {gameTime} • {relativeTime}
        </time>
        <div className="flex-1"></div>
        <div className="flex flex-none items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {beatmap.source || "No source"}
          </p>
          <div className="h-4 w-px border border-muted-foreground"></div>
          <div className="flex items-center gap-1">
            {/* eslint-disable-next-line */}
            {[...Array(Math.round(beatmap.difficultyrating))].map((_, i) => (
              <StarIcon
                key={`${game.id}-star-${i}`}
                className="block h-4 w-4 text-yellow-300"
                size={16}
                strokeWidth={1}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="ml-auto flex flex-col">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">
            {game.playerPassedCount} out of {game.playerFinishCount} player
            passed.
          </span>
        </div>
      </div>
    </li>
  );
}

function GameEntrySkeleton() {
  return (
    <li className="rounded-sm border p-3 shadow">
      <Skeleton />
    </li>
  );
}
