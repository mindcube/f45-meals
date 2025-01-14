"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Users, ChefHat, Flame } from "lucide-react";
import { getRecipeDetails } from "@/lib/api";
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
import { convertToOunces } from "@/lib/utils";

interface RecipeModalProps {
  recipeId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeModal({ recipeId, isOpen, onClose }: RecipeModalProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecipe() {
      if (recipeId) {
        setLoading(true);
        try {
          const data = await getRecipeDetails(recipeId);
          setRecipe(data);
        } catch (error) {
          console.error("Failed to fetch recipe:", error);
        }
        setLoading(false);
      }
    }

    if (isOpen && recipeId) {
      fetchRecipe();
    }
  }, [recipeId, isOpen]);

  const recipeData = recipe?.recipe_data?.[0];

  const formatIngredient = (item: {
    ingredient_measurement?: { abbreviation: string };
    amount: number;
    modifier?: string;
    ingredient?: { title: string };
  }) => {
    const measurement = item.ingredient_measurement?.abbreviation || "";
    const converted = convertToOunces(item.amount, measurement);

    return (
      <>
        {converted.value} {converted.unit}
        {item.modifier && ` ${item.modifier}`}
        {item.ingredient?.title && ` ${item.ingredient.title}`}
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {loading ? "Loading Recipe..." : recipe?.title}
          </DialogTitle>
          {!loading && recipe && (
            <div className="flex flex-wrap gap-2 mt-2">
              {recipe.dietary_preferences.map((pref) => (
                <Badge key={pref.id} variant="secondary">
                  {pref.title}
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            Loading recipe details...
          </div>
        ) : recipe ? (
          <>
            {recipe.feature_image?.url && (
              <div className="relative w-full h-72">
                <Image
                  src={recipe.feature_image.url}
                  alt={recipe.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
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
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                <ul className="space-y-1">
                  {recipeData.ingredients.map((item) => (
                    <li key={item.id} className="text-gray-600">
                      {formatIngredient(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recipeData?.method && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Method</h3>
                <div
                  className="text-gray-600 prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipeData.method }}
                />
              </div>
            )}

            {recipeData?.nutrition?.nutritional_information && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">
                  Nutrition Information
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Per serving size:{" "}
                  {(
                    recipeData.nutrition.nutritional_information.serving_size *
                    0.035274
                  ).toFixed(1)}{" "}
                  oz
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
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
