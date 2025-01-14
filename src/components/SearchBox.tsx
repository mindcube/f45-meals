"use client";

import { Input } from "@/components/ui/input";
import { useSearch } from "./SearchProvider";
import { Search } from "lucide-react";

export function SearchBox() {
  const { searchTerm, setSearchTerm } = useSearch();

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    </div>
  );
}
