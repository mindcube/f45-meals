"use client";

import { useSearch } from "./SearchProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBox } from "./SearchBox";
import { RecipeModal } from "./RecipeDetailModal";
import { useState } from "react";
import type { Meal, MealPlan } from "@/app/types/meal";
import { MealCard } from "./MealCard";
import { ShoppingList } from "./ShoppingList";

export interface MealPlanDisplayProps {
  initialData: MealPlan | null;
  initialChallenge: number;
}

export default function MealPlanDisplay({
  initialData,
  initialChallenge,
}: MealPlanDisplayProps) {
  const { searchTerm } = useSearch();
  const router = useRouter();
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const filterMeals = (meals: Meal[]) => {
    if (!searchTerm) return meals;
    return meals.filter(
      (meal) =>
        meal.recipe?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>F45 Meal Planner</CardTitle>
              <Select
                value={initialChallenge.toString()}
                onValueChange={(value) => router.push(`/?challenge=${value}`)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Challenge" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 45 }, (_, i) => i + 1).map(
                    (challenge) => (
                      <SelectItem key={challenge} value={challenge.toString()}>
                        Challenge {challenge}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <SearchBox />
          </CardHeader>
        </Card>

        {!initialData ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p>No meal plan found for Challenge {initialChallenge}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {initialData.days.map((day) => {
              const filteredMeals = filterMeals(day.meals);
              if (filteredMeals.length === 0 && searchTerm) return null;

              return (
                <Card key={day.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {day.title}
                      {day.is_celebration_day && " 🎉"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {filteredMeals.map((meal) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          onClick={() =>
                            setSelectedRecipeId(meal.recipe?.id || null)
                          }
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <RecipeModal
          recipeId={selectedRecipeId}
          isOpen={!!selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      </div>

      <ShoppingList />
    </>
  );
}
