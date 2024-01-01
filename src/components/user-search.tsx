"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { trpc } from "~/utils/api";
import { Button } from "./ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { env } from "~/env.mjs";
import algoliasearch from "algoliasearch";
import { InstantSearch, useHits, useSearchBox } from "react-instantsearch";

const searchClient =
  env.NEXT_PUBLIC_ALGOLIA_ENABLED &&
  env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
  env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
    ? algoliasearch(
        env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
      )
    : null;

type UserHit = {
  objectID: string;
  name: string;
  userId: number;
  image: string;
  matchesPlayed: number;
  numberOneResults: number;
  playtime: number;
};

function UsersInstantSearch({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  if (!searchClient) throw new Error("Search client not initialized");

  const searchBox = useSearchBox({});
  const { hits } = useHits<UserHit>({});

  return (
    <>
      {/* <SearchBox /> */}
      {/* <Hits /> */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={searchBox.query}
          onValueChange={(v) => searchBox.refine(v)}
        />
        <CommandList>
          <CommandEmpty>No Results.</CommandEmpty>
          {hits && (
            <CommandGroup heading="Users">
              {hits.map((hit) => (
                <CommandItem
                  key={hit.objectID}
                  onSelect={() =>
                    (window.location.href = `/user/${hit.userId ?? hit.name}`)
                  }
                >
                  {hit.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
      <Button onClick={() => setOpen(true)}>
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    </>
  );
}

export function UserSearch() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const { data, isLoading, error } = trpc.user.search.useQuery(
    { username },
    {
      enabled: username.length > 1,
    },
  );

  if (searchClient) {
    return (
      <InstantSearch
        searchClient={searchClient}
        indexName="users"
        routing={false}
      >
        <UsersInstantSearch open={open} setOpen={setOpen} />
      </InstantSearch>
    );
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput value={username} onValueChange={(v) => setUsername(v)} />
        <CommandList>
          <CommandEmpty>No Results.</CommandEmpty>
          {data && (
            <CommandGroup heading="Users">
              {data.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() =>
                    (window.location.href = `/user/${user.userId ?? user.name}`)
                  }
                >
                  {user.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
      <Button onClick={() => setOpen(true)}>
        <SearchIcon className="h-4 w-4 mr-2" />
        Search
      </Button>
    </>
  );
}
