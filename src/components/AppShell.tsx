"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, ShoppingCart } from "lucide-react";
import { BottomNav } from "./BottomNav";
import { ShoppingList } from "./ShoppingList";
import { useShoppingList } from "@/app/contexts/ShoppingListContext";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { selectedMeals, setIsOpen } = useShoppingList();

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-secondary text-foreground"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col md:max-w-5xl lg:max-w-6xl">
      <header
        className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-black text-primary-foreground">
              F45
            </span>
            <span className="text-sm font-bold uppercase tracking-widest">
              Meal Planner
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/" className={linkClass(pathname === "/")}>
              <CalendarDays className="h-4 w-4" />
              Plan
            </Link>
            <Link
              href="/favorites"
              className={linkClass(pathname === "/favorites")}
            >
              <Heart className="h-4 w-4" />
              Favorites
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={linkClass(false)}
            >
              <span className="relative">
                <ShoppingCart className="h-4 w-4" />
                {selectedMeals.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
                    {selectedMeals.length}
                  </span>
                )}
              </span>
              List
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-10">{children}</main>

      <BottomNav />
      <ShoppingList />
    </div>
  );
}
