"use client";

import { InfoIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
}

const commands: {
  title: string;
  value: string;
  commands: Command[];
}[] = [
  {
    title: "General",
    value: "general",
    commands: [
      {
        name: "queue",
        aliases: ["q"],
        description: "Displays the current auto host rotate queue.",
      },
      {
        name: "queuepos",
        aliases: ["qp"],
        description: "Displays your current position in the queue.",
      },
      {
        name: "skip",
        aliases: ["s"],
        description:
          "Allows you to skip your turn as host, or initiate a vote skip for the current host as a non-host player.",
      },
      {
        name: "start",
        description:
          "Allows the host to start a match start timer, or for the non-host players to vote to start the match.",
        usage: "[seconds]",
      },
      {
        name: "stop",
        description: "Allows the host to stop any ongoing match start timer.",
      },
      {
        name: "regulations",
        aliases: ["r"],
        description:
          "Displays the current map regulations, such as star rating and/or map length.",
      },
      {
        name: "abort",
        description: "Vote to abort the currently on-going match",
      },
      {
        name: "playtime",
        description: "Shows your current and total playtime.",
        aliases: ["pt"],
      },
      {
        name: "ps",
        description: "Shows your total matches played and #1's",
        aliases: ["ps"],
      },
      {
        name: "mapstats",
        description: "Shows play stats of the currently picked map.",
        aliases: ["ms"],
      },
      {
        name: "rs",
        description: "Shows information about your most recent score.",
      },
      {
        name: "timeleft",
        description:
          "Shows the estimated time left of the current map, useful if you joined during an ongoing match.",
      },
      {
        name: "autoskip",
        description:
          "Feeling like just tagging along? Auto-skip will automatically skip your turn.",
        usage: "<on|off>",
      },
      {
        name: "mirror",
        description: "Sends a download link to the map from a mirror.",
      },
      {
        name: "help",
        description: "Sends a link to the command/help page.",
      },
    ],
  },
  {
    title: "Admin",
    value: "admin",
    commands: [
      {
        name: "forceskip",
        description: "Will skip the current host, without any vote.",
      },
      {
        name: "sethost",
        description: "Sets a new host for the round.",
        usage: "<username>",
      },
      {
        name: "setqueuepos",
        description:
          "Sets a new queue position for the player. Queue position starts from zero.",
        usage: "<username> <position>",
      },
      {
        name: "ban",
        description:
          "Ban a user, will run !mp ban and also save the username and automatically ban in future lobbies",
        usage: "<username>",
      },
      {
        name: "banmapset",
        description: "Ban a mapset by id",
        usage: "<mapset id>",
      },
      {
        name: "config",
        description: "Update the lobby properties directly in-game",
        usage: "<key> <value>",
      },
      {
        name: "addref",
        description:
          "Adds you as a match referee to use bancho tournament commands.",
      },
      {
        name: "togglemapcheck",
        description: "Toggle map regulation checker for the lobby.",
      },
    ],
  },
  {
    title: "Debug",
    value: "debug",
    commands: [
      {
        name: "uptime",
        description: "Shows the bot up-time",
      },
      {
        name: "issuetime",
        description: "Shows the last time since a bot networking issue.",
      },
      {
        name: "version",
        description: "Shows the current bot version",
      },
    ],
  },
];

const prefix = "!";

export default function Commands() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold tracking-tight text-muted-foreground">
        Overview
      </h1>
      <p className="max-w-[500px] text-foreground">
        An osu! multiplayer bot that will maintain a queue and pass the host
        around every match automatically. You are automatically added to the
        queue upon joining the match.
      </p>

      <Separator />
      <h3 className="text-2xl font-bold tracking-tight text-muted-foreground">
        Commands
      </h3>
      <div className="flex items-center gap-4 rounded-[var(--radius)] border border-secondary bg-accent p-4">
        <InfoIcon className="h-6 w-6" />
        <div className="space-y-2">
          <p className="text-sm">
            <code className="bg-background px-1.5 py-1 text-destructive-foreground">
              [...]
            </code>{" "}
            means optional,{" "}
            <code className="bg-background px-1.5 py-1 text-destructive-foreground">
              &lt;...&gt;
            </code>{" "}
            means required.{" "}
            <code className="bg-background px-1.5 py-1 text-destructive-foreground">
              ...|...
            </code>{" "}
            means &quot;or&quot;. For example,{" "}
            <code className="mr-1 bg-background px-1.5 py-1 text-destructive-foreground">
              {prefix}autoskip on
            </code>{" "}
            <code className="bg-background px-1.5 py-1 text-destructive-foreground">
              {prefix}start 10
            </code>{" "}
          </p>
          <div className="text-sm">
            Note that the arguments do not have to be surrounded by the brackets
            and angle brackets, they are just there to indicate that they are
            arguments.
          </div>
        </div>
      </div>
      <Tabs defaultValue="general">
        <TabsList>
          {commands.map((category) => (
            <TabsTrigger key={category.title} value={category.value}>
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {commands.map((category) => (
          <TabsContent key={category.title} value={category.value}>
            <ul className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {category.commands.map((command) => (
                <li key={command.name} className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>
                        <code className="bg-background px-1.5 py-1 text-lg text-destructive-foreground">
                          {prefix}
                          {command.name}
                          {command.usage ? ` ${command.usage}` : ""}
                        </code>
                      </CardTitle>
                      {command.aliases && (
                        <CardDescription>
                          Aliases:{" "}
                          {command.aliases.map((alias) => (
                            <code key={alias}>{alias}</code>
                          ))}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p>{command.description}</p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
