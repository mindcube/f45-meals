"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Heart, Users } from "lucide-react";
import { useFavorites } from "@/app/hooks/useFavorites";
import { getRecipeDetails } from "@/lib/api";
import type { Recipe } from "@/app/types/meal";

export function FavoritesView() {
  const { favorites, toggleFavorite } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      setIsLoading(true);
      try {
        const results = await Promise.all(
          favorites.map((id) => getRecipeDetails(id))
        );
        if (!cancelled) setRecipes(results);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadFavorites();
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  return (
    <div className="space-y-5 p-4">
      <h1 className="text-2xl font-black tracking-tight">Favorites</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading your favorites...</p>
      ) : recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
          <Heart className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            Tap the heart on any recipe to save it here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-3"
            >
              <Link
                href={`/recipe/${recipe.id}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary"
              >
                {recipe.feature_image?.url && (
                  <Image
                    src={recipe.feature_image.url}
                    alt={recipe.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                )}
              </Link>

              <Link
                href={`/recipe/${recipe.id}`}
                className="flex min-w-0 flex-1 flex-col justify-center"
              >
                <h3 className="line-clamp-2 font-semibold leading-tight">
                  {recipe.title}
                </h3>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {recipe.cook_time_in_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {recipe.serves}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => toggleFavorite(recipe.id)}
                aria-label="Remove from favorites"
                className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full text-primary"
              >
                <Heart className="h-5 w-5" fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
