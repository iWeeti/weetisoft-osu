import { NextRequest, NextResponse } from "next/server";
import { getAlgoliaAdminClient } from "~/lib/algolia";
import { db } from "~/server/db";

export async function GET(req: NextRequest) {
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      userId: true,
      matchesPlayed: true,
      playtime: true,
      numberOneResults: true,
    },
  });

  return NextResponse.json(
    users.map((user) => ({
      ...user,
      objectID: user.id,
      id: undefined,
    })),
  );
}
