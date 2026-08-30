"use client";

import { useShoppingList } from "@/app/contexts/ShoppingListContext";
import Image from "next/image";
import { Check, Clock, Heart, Plus, Users } from "lucide-react";
import { Meal } from "@/app/types/meal";
import { useFavorites } from "@/app/hooks/useFavorites";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { selectedMeals, addMeal, removeMeal } = useShoppingList();
  const { isFavorite } = useFavorites();
  const isSelected = selectedMeals.some((m) => m.id === meal.id);
  const recipeFavorite = meal.recipe?.id ? isFavorite(meal.recipe.id) : false;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelected) {
      removeMeal(meal.id);
    } else {
      addMeal({
        id: meal.id,
        title: meal.recipe?.title || meal.title,
        recipeId: meal.recipe?.id,
        defaultServings: meal.recipe?.serves || 1,
        requestedServings: meal.recipe?.serves || 1,
        leftover: meal.leftover,
      });
    }
  };

  return (
    <Link
      href={`/recipe/${meal.recipe?.id}`}
      className={cn(
        "group flex gap-3 overflow-hidden rounded-2xl border bg-card p-3 transition-colors active:bg-secondary/50",
        isSelected ? "border-primary" : "border-border"
      )}
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-secondary">
        {meal.recipe?.feature_image?.url && (
          <Image
            src={meal.recipe.feature_image.url}
            alt={meal.recipe.title || "Recipe image"}
            fill
            className="object-cover"
            sizes="96px"
          />
        )}
        {recipeFavorite && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-background/70 p-1">
            <Heart className="h-3.5 w-3.5 text-primary" fill="currentColor" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-1 flex items-center gap-2">
          <span className="truncate text-xs font-semibold uppercase tracking-wide text-primary">
            {meal.meal_type?.title}
          </span>
          {meal.leftover && (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Leftover
            </span>
          )}
        </div>

        <h3 className="line-clamp-2 font-semibold leading-tight">
          {meal.recipe?.title || meal.title}
        </h3>

        {meal.recipe && (
          <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {meal.recipe.cook_time_in_minutes} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {meal.recipe.serves}
            </span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleToggle}
        aria-label={isSelected ? "Remove from shopping list" : "Add to shopping list"}
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border-2 transition-colors",
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground group-hover:border-primary"
        )}
      >
        {isSelected ? (
          <Check className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </button>
    </Link>
  );
}
