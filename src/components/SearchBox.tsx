"use client";

import { Input } from "@/components/ui/input";
import { useSearch } from "./SearchProvider";
import { Search } from "lucide-react";

export function SearchBox() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="rounded-full pl-10"
      />
    </div>
  );
}
