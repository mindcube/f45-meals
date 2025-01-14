"use client";

import { Card } from "@/components/ui/card";
import { useShoppingList } from "@/app/contexts/ShoppingListContext";
import Image from "next/image";
import { Clock, Heart, Users } from "lucide-react";
import { Meal } from "@/app/types/meal";
import { useFavorites } from "@/app/hooks/useFavorites";
import Link from "next/link";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { selectedMeals, addMeal, removeMeal } = useShoppingList();
  const { isFavorite } = useFavorites();
  const isSelected = selectedMeals.some((m) => m.id === meal.id);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (isSelected) {
      removeMeal(meal.id);
    } else {
      addMeal({
        id: meal.id,
        title: meal.recipe?.title || meal.title,
        recipeId: meal.recipe?.id,
        defaultServings: meal.recipe?.serves || 1,
        requestedServings: meal.recipe?.serves || 1,
      });
    }
  };

  return (
    <Link href={`/recipe/${meal.recipe?.id}`}>
      <Card className="overflow-hidden hover:bg-gray-50 cursor-pointer transition-colors group">
        <div className="relative">
          <div
            className="absolute top-3 left-3 z-10"
            onClick={handleCheckboxClick}
          >
            <div
              className={`
              w-6 h-6 rounded-full
              flex items-center justify-center
              transition-colors
              ${
                isSelected
                  ? "bg-primary"
                  : "bg-white border-2 border-gray-200 group-hover:border-primary"
              }
            `}
            >
              {isSelected && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>

          {meal.recipe?.id && isFavorite(meal.recipe.id) && (
            <div className="absolute top-3 right-3 z-10">
              <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 p-4">
            {meal.recipe?.feature_image?.url && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={meal.recipe.feature_image.url}
                  alt={meal.recipe.title || "Recipe image"}
                  fill
                  className="object-cover rounded-md"
                  sizes="96px"
                />
              </div>
            )}
            <div className="flex-grow">
              <h3 className="font-semibold">
                {meal.recipe?.title || meal.title}
              </h3>
              <div className="text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-2">
                  <span>{meal.meal_type?.title}</span>
                  {meal.leftover && (
                    <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full">
                      Leftover
                    </span>
                  )}
                </div>
              </div>
              {meal.recipe && (
                <div className="flex gap-4 mt-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {meal.recipe.cook_time_in_minutes} mins
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    Serves {meal.recipe.serves}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
