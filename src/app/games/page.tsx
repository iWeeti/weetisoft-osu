import { db } from "~/server/db";
import { GameEntry } from "./game-entry";
import { desc } from "drizzle-orm";
import { games } from "~/server/db/schema";
import { type Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Games",
  description: "View the latest games played by players",
};

export default async function GamesPage() {
  const entries = await db.query.games.findMany({
    limit: 50,
    orderBy: () => desc(games.time),
    where: (g, { gt }) => gt(g.playerCount, 0),
  });

  return (
    <div>
      <ul className="space-y-5">
        {entries.map((game) => (
          <GameEntry game={game} key={game.id} />
        ))}
      </ul>
    </div>
  );
}
