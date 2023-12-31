"use client";

import { Card, Text, Title, Tracker } from "@tremor/react";
import {
  GithubIcon,
  LogInIcon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { type ReactNode } from "react";
import { ModeToggle } from "~/components/mode-toggle";
import { trpc } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserSearch } from "../user-search";

export function BaseLayout({ children }: { children: ReactNode }) {
  const { data, status } = useSession();
  const { data: botStatus } = trpc.stats.connected.useQuery();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="border-b py-4 shadow">
        <nav className="container flex flex-none items-center justify-between gap-4 ">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="block md:hidden">AHR</span>
              <span className="md:inline-block hidden">Auto Host Rotate</span>
            </Link>
            <div className="hidden md:flex items-center gap-4 text-muted-foreground">
              <Link href="/games">Games</Link>
              <Link href="/commands">Commands</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <UserSearch />
            <ModeToggle />
            {/* {status === "authenticated" && data && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    {data.user.image && <AvatarImage src={data.user.image} />}
                    <AvatarFallback>{data.user.name}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="text-sm">
                    {data.user.name}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserCircleIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {status === "unauthenticated" && (
              <Button size="icon" variant="outline" onClick={() => signIn()}>
                <LogInIcon className="h-4 w-4" />
              </Button>
            )} */}
          </div>
        </nav>
      </div>
      <div className="container flex-1 py-10">{children}</div>
      <footer className="flex-none border-t py-10">
        <div className="container flex justify-between gap-2 max-md:flex-col">
          <div className="space-y-2 text-muted-foreground">
            <p className="text-sm">
              Made with ❤️ by{" "}
              <Link
                href="https://osu.ppy.sh/users/8332532"
                className="underline"
              >
                iWeeti
              </Link>
            </p>
            <p className="text-sm">
              Bot by{" "}
              <Link
                href="https://osu.ppy.sh/users/10826852"
                className="underline"
              >
                matte
              </Link>
              , source code on{" "}
              <Link
                href="https://github.com/matte-ek/BanchoMultiplayerBot"
                className="underline"
              >
                GitHub
              </Link>
            </p>
          </div>
          <div>
            {botStatus && (
              <Card>
                <Title>Bot Status Last 12 hours</Title>
                <Text>
                  {botStatus.results.connected?.frames[0]?.data.values[1]?.[
                    botStatus.results.connected?.frames[0]?.data.values[1]
                      .length - 1
                  ] === 1
                    ? "Connected"
                    : "Disconnected"}
                </Text>
                <Tracker
                  data={
                    botStatus.results.A?.frames[0]?.data.values[1]?.map(
                      (d, i) => ({
                        key: i,
                        color: d >= 99 ? "green" : d >= 80 ? "yellow" : "red",
                        tooltip: `${new Intl.NumberFormat("en-US", {
                          style: "percent",
                        }).format(d / 100)} (${new Date(
                          botStatus.results.A?.frames[0]?.data.values[0]?.[i] ??
                          0,
                        ).toLocaleString()})`,
                      }),
                    ) ?? []
                  }
                  style={{
                    width: "300px",
                  }}
                  className="mt-2"
                />
              </Card>
            )}
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="https://github.com/iWeeti/weetisoft-osu">
              <GithubIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
