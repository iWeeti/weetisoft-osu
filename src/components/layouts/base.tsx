"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "~/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  GithubIcon,
  LogInIcon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function BaseLayout({ children }: { children: ReactNode }) {
  const { data, status } = useSession();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <div className="border-b py-4 shadow">
        <nav className="container flex flex-none items-center justify-between gap-4 ">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              WeetiSoft osu!
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/games">Games</Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {status === "authenticated" && data && (
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
            )}
          </div>
        </nav>
      </div>
      <div className="container flex-1 py-10">{children}</div>
      <footer className="flex-none border-t py-10">
        <div className="container flex justify-between gap-2 max-md:flex-col">
          <p className="text-center text-sm">
            Made with ❤️ by{" "}
            <Link href="https://osu.ppy.sh/users/Weeti" className="underline">
              iWeeti
            </Link>
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="https://github.com/iWeeti">
              <GithubIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
