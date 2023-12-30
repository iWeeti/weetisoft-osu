'use client';

import Link from "next/link";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { trpc } from "~/utils/api";

export function UserTabs({ userId }: { userId: number }) {
    const [tab, setTab] = useState<string>("top-5");
    const [limit, setLimit] = useState(5);

    const { data: top5 } = trpc.user.top5Scores.useQuery({ userId, limit }, {
        enabled: tab === "top-5"
    });
    const { data: recent } = trpc.user.recentScores.useQuery({ userId, limit }, {
        enabled: tab === "recent"
    });
    const playtimeFormat = new Intl.NumberFormat("en-US", {
        style: "unit",
        unit: "hour",
        unitDisplay: "long",
        maximumFractionDigits: 1,
    });

    const unitFormat = new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 1,
    });

    return (
        <div className="space-y-4">
            <Tabs value={tab} onValueChange={setTab}>
                <div className="flex items-center gap-5 justify-between">
                    <TabsList>
                        <TabsTrigger value="top-5">Top 5 Scores</TabsTrigger>
                        <TabsTrigger value="recent">Recent Scores</TabsTrigger>
                    </TabsList>
                    <Select value={limit.toString()} onValueChange={(v) => setLimit(parseInt(v))}>
                        <SelectTrigger className="max-w-[100px]">
                            <SelectValue>
                                Show {limit.toString()}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"5"}>5</SelectItem>
                            <SelectItem value={"10"}>10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <TabsContent value="top-5">
                    <ul className="space-y-5 my-5">

                        {(top5 ?? []).map((score) => {
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
                                            className="flex-none hover:underline text-white"
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
                                            <p className="text-lg text-white">
                                                {unitFormat.format(score.totalScore)}
                                            </p>
                                            <div className="h-4 w-px border border-muted-foreground"></div>
                                            <p className="text-lg text-muted-foreground">{unitFormat.format(score.maxCombo)}x</p>

                                            <div className="h-4 w-px border border-muted-foreground"></div>
                                            <p className="text-lg text-muted-foreground">Placed #{unitFormat.format(score.rank)} <span className="hidden md:inline-block"> in the lobby</span></p>
                                        </div>
                                    </div>
                                    <div className="ml-auto hidden md:flex flex-col">
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
                </TabsContent><TabsContent value="recent">
                    <ul className="space-y-5 my-5">

                        {(recent ?? []).map((score) => {
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
                                            className="flex-none hover:underline text-white"
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
                                            <p className="text-lg text-white">
                                                {unitFormat.format(score.totalScore)}
                                            </p>
                                            <div className="h-4 w-px border border-muted-foreground"></div>
                                            <p className="text-lg text-muted-foreground">{unitFormat.format(score.maxCombo)}x</p>

                                            <div className="h-4 w-px border border-muted-foreground"></div>
                                            <p className="text-lg text-muted-foreground">Placed #{unitFormat.format(score.rank)} <span className="hidden md:inline-block"> in the lobby</span></p>
                                        </div>
                                    </div>
                                    <div className="ml-auto hidden md:flex flex-col">
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
                </TabsContent>
            </Tabs>
        </div>
    )
}