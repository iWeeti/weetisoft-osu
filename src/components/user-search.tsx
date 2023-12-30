'use client';

import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { trpc } from "~/utils/api";
import { Button } from "./ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";

export function UserSearch() {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const { data, isLoading, error } = trpc.user.search.useQuery({ username }, {
        enabled: username.length > 1
    });

    return <>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput value={username} onValueChange={(v) => setUsername(v)} />
            <CommandList>
                <CommandEmpty>No Results.</CommandEmpty>
                {data && (
                    <CommandGroup heading="Users">
                        {data.map((user) => (
                            <CommandItem key={user.id} onSelect={() => window.location.href = `/user/${user.userId ?? user.name}`}>
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
    </>;
}