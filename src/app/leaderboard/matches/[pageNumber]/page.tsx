import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

const pageSize = 50;
export const revalidate = 0;

export default async function MatchesPlayedLeaderboard({
  params,
}: {
  params: { pageNumber: string };
}) {
  const pageNumber = parseInt(params.pageNumber);

  if (Number.isNaN(pageNumber)) {
    notFound();
  }

  const data = await db.query.users.findMany({
    limit: pageSize,
    offset: pageNumber * pageSize,
    columns: {
      id: true,
      name: true,
      matchesPlayed: true,
    },
    orderBy: desc(users.matchesPlayed),
  });

  return (
    <div className="space-y-5">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                pageNumber > 0
                  ? `/leaderboard/matches/${pageNumber - 1}`
                  : undefined
              }
            />
          </PaginationItem>
          {pageNumber > 1 && (
            <>
              <PaginationItem>
                <PaginationLink href={`/leaderboard/matches/0`}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          {pageNumber > 0 && (
            <PaginationItem>
              <PaginationLink href={`/leaderboard/matches/${pageNumber - 1}`}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={`/leaderboard/matches/${pageNumber}`}>
              {pageNumber + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={`/leaderboard/matches/${pageNumber + 1}`}>
              {pageNumber + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`/leaderboard/matches/${pageNumber + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <ul className="space-y-5">
        {data.map((user, i) => (
          <li key={user.id}>
            <div className="flex items-center gap-2 justify-between bg-card rounded-[var(--radius)] p-5">
              <div className="flex items-center">
                {/* <Image src={`https://a.ppy.sh/${user.id}?.png`} width={64} height={64} alt={user.name} className="rounded-[var(--radius)]" /> */}
                <Link
                  href={`/user/${encodeURIComponent(user.name)}`}
                  className="hover:underline text-lg font-bold tracking-tight"
                >
                  {user.name}
                </Link>
              </div>
              <div className="flex items-center gap-5">
                <p className="text-muted-foreground">
                  {user.matchesPlayed} matches played
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  #{pageSize * pageNumber + i + 1}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={
                pageNumber > 0
                  ? `/leaderboard/matches/${pageNumber - 1}`
                  : undefined
              }
            />
          </PaginationItem>
          {pageNumber > 1 && (
            <>
              <PaginationItem>
                <PaginationLink href={`/leaderboard/matches/0`}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}
          {pageNumber > 0 && (
            <PaginationItem>
              <PaginationLink href={`/leaderboard/matches/${pageNumber - 1}`}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem>
            <PaginationLink href={`/leaderboard/matches/${pageNumber}`}>
              {pageNumber + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={`/leaderboard/matches/${pageNumber + 1}`}>
              {pageNumber + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={`/leaderboard/matches/${pageNumber + 1}`} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
