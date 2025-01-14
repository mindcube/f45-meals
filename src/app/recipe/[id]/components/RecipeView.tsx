// app/components/RecipeView.tsx
"use client";

import Image from "next/image";
import { Clock, Users, ChefHat, Flame, Heart } from "lucide-react";
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
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
          <div className="flex flex-wrap gap-2">
            {recipe.dietary_preferences.map((pref) => (
              <Badge key={pref.id} variant="secondary">
                {pref.title}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite(recipe.id)}
          className={isFavorite(recipe.id) ? "text-red-500" : ""}
        >
          <Heart
            className="h-6 w-6"
            fill={isFavorite(recipe.id) ? "currentColor" : "none"}
          />
        </Button>
      </div>

      {recipe.feature_image?.url && (
        <div className="relative w-full h-72 mb-6">
          <Image
            src={recipe.feature_image.url}
            alt={recipe.title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 700px"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {recipe.cook_time_in_minutes} mins
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          Serves {recipe.serves}
        </div>
        <div className="flex items-center">
          <ChefHat className="h-4 w-4 mr-1" />
          Skill Level {recipe.skill_level}
        </div>
        {recipeData?.nutrition && (
          <div className="flex items-center">
            <Flame className="h-4 w-4 mr-1" />
            {recipeData.nutrition.calories_per_serve} cal per serve
          </div>
        )}
      </div>

      {recipeData?.ingredients && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {recipeData.ingredients.map((item) => {
              const measurement =
                item.ingredient_measurement?.abbreviation || "";
              const converted = convertToOunces(item.amount, measurement);

              return (
                <li key={item.id} className="text-gray-600">
                  {converted.value} {converted.unit}
                  {item.modifier && ` ${item.modifier}`}
                  {item.ingredient?.title && ` ${item.ingredient.title}`}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {recipeData?.method && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Method</h2>
          <div
            className="text-gray-600 prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: recipeData.method }}
          />
        </div>
      )}

      {recipeData?.nutrition?.nutritional_information && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Nutrition Information</h2>
          <p className="text-sm text-gray-600 mb-2">
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
