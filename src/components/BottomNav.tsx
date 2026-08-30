"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, ShoppingCart } from "lucide-react";
import { useShoppingList } from "@/app/contexts/ShoppingListContext";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { selectedMeals, setIsOpen } = useShoppingList();

  const itemClass = (active: boolean) =>
    cn(
      "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors",
      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
    );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/80 md:hidden">
      <div
        className="mx-auto flex max-w-md items-stretch"
        style={{ paddingBottom: "var(--safe-bottom)" }}
      >
        <Link href="/" className={itemClass(pathname === "/")}>
          <CalendarDays className="h-5 w-5" />
          Plan
        </Link>

        <Link href="/favorites" className={itemClass(pathname === "/favorites")}>
          <Heart className="h-5 w-5" />
          Favorites
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={itemClass(false)}
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            {selectedMeals.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                {selectedMeals.length}
              </span>
            )}
          </span>
          List
        </button>
      </div>
    </nav>
  );
}
