// app/components/RecipeView.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChefHat, Clock, Flame, Heart, Users } from "lucide-react";
import type { Recipe } from "@/app/types/meal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/app/hooks/useFavorites";
import { convertToOunces } from "@/lib/utils";

interface RecipeViewProps {
  recipe: Recipe;
}

export function RecipeView({ recipe }: RecipeViewProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const recipeData = recipe.recipe_data?.[0];

  return (
    <div className="mx-auto max-w-3xl lg:max-w-5xl">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to plan
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        {recipe.feature_image?.url && (
          <div className="relative mb-5 h-60 w-full overflow-hidden rounded-2xl lg:mb-0 lg:h-80 lg:sticky lg:top-20">
            <Image
              src={recipe.feature_image.url}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
              priority
            />
          </div>
        )}

        <div>
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h1 className="mb-2 text-2xl font-black tracking-tight lg:text-3xl">
                {recipe.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_preferences.map((pref) => (
                  <Badge key={pref.id} variant="secondary">
                    {pref.title}
                  </Badge>
                ))}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleFavorite(recipe.id)}
              aria-label={
                isFavorite(recipe.id)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className={`shrink-0 rounded-full ${
                isFavorite(recipe.id) ? "border-primary text-primary" : ""
              }`}
            >
              <Heart
                className="h-5 w-5"
                fill={isFavorite(recipe.id) ? "currentColor" : "none"}
              />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <Stat
              icon={<Clock className="h-4 w-4" />}
              label={`${recipe.cook_time_in_minutes} min`}
            />
            <Stat
              icon={<Users className="h-4 w-4" />}
              label={`Serves ${recipe.serves}`}
            />
            <Stat
              icon={<ChefHat className="h-4 w-4" />}
              label={`Skill ${recipe.skill_level}`}
            />
            {recipeData?.nutrition && (
              <Stat
                icon={<Flame className="h-4 w-4" />}
                label={`${recipeData.nutrition.calories_per_serve} cal`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
        {recipeData?.ingredients && (
          <div className="mb-6 lg:mb-0">
            <h2 className="mb-3 text-xl font-bold">Ingredients</h2>
            <ul className="space-y-2">
              {recipeData.ingredients.map((item) => {
                const measurement =
                  item.ingredient_measurement?.abbreviation || "";
                const converted = convertToOunces(item.amount, measurement);

                return (
                  <li
                    key={item.id}
                    className="flex gap-2 border-b border-border/60 pb-2 text-sm"
                  >
                    <span className="font-semibold text-primary">
                      {converted.value} {converted.unit}
                    </span>
                    <span className="text-muted-foreground">
                      {item.modifier && `${item.modifier} `}
                      {item.ingredient?.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {recipeData?.method && (
          <div className="mb-6 lg:mb-0">
            <h2 className="mb-3 text-xl font-bold">Method</h2>
            <div
              className="prose prose-invert max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: recipeData.method }}
            />
          </div>
        )}
      </div>

      {recipeData?.nutrition?.nutritional_information && (
        <div className="mt-8">
          <h2 className="mb-3 text-xl font-bold">Nutrition Information</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Per serving size:{" "}
            {recipeData.nutrition.nutritional_information.serving_size}g
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutrient</TableHead>
                <TableHead className="text-right">Per Serving</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipeData.nutrition.nutritional_information.nutrients.map(
                (nutrient) => (
                  <TableRow key={nutrient.id}>
                    <TableCell className="font-medium">
                      {nutrient.title}
                    </TableCell>
                    <TableCell className="text-right">
                      {nutrient.qty_per_serving}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm">
      <span className="text-primary">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
