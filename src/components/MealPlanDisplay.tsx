"use client";

import { useSearch } from "./SearchProvider";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBox } from "./SearchBox";
import { useState, useEffect } from "react";
import type { Meal, MealPlan, Day, Challenge } from "@/app/types/meal";
import { MealCard } from "./MealCard";
import { useShoppingList } from "@/app/contexts/ShoppingListContext";
import { cn } from "@/lib/utils";

export interface MealPlanDisplayProps {
  initialData: MealPlan | null;
  initialChallenge: number;
  challenges: Challenge[];
}

export default function MealPlanDisplay({
  initialData,
  initialChallenge,
  challenges,
}: MealPlanDisplayProps) {
  const { searchTerm } = useSearch();
  const { selectedMeals, addMeal, removeMeal } = useShoppingList();
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatChallengeName = (challenge: Challenge): string => {
    if (challenge.short_name && challenge.name) {
      return `${challenge.short_name} - ${challenge.name}`;
    }
    if (challenge.name) {
      return challenge.name;
    }
    return `Challenge ${challenge.id}`;
  };

  const initialWeek = parseInt(searchParams.get("week") || "1");
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek);

  useEffect(() => {
    const week = parseInt(searchParams.get("week") || "1");
    setSelectedWeek(week);
  }, [searchParams]);

  const getWeekDays = (days: Day[]) => {
    const startIndex = (selectedWeek - 1) * 7;
    return days.slice(startIndex, startIndex + 7);
  };

  const weekMeals = initialData
    ? getWeekDays(initialData.days).flatMap((day) => day.meals)
    : [];
  const allWeekSelected =
    weekMeals.length > 0 &&
    weekMeals.every((meal) =>
      selectedMeals.some((selected) => selected.id === meal.id)
    );

  const handleSelectAllWeek = () => {
    if (allWeekSelected) {
      weekMeals.forEach((meal) => removeMeal(meal.id));
    } else {
      weekMeals.forEach((meal) => {
        if (!selectedMeals.some((selected) => selected.id === meal.id)) {
          addMeal({
            id: meal.id,
            title: meal.recipe?.title || meal.title,
            recipeId: meal.recipe?.id,
            defaultServings: meal.recipe?.serves || 1,
            requestedServings: meal.recipe?.serves || 1,
            leftover: meal.leftover,
          });
        }
      });
    }
  };

  const filterMeals = (meals: Meal[]) => {
    if (!searchTerm) return meals;
    return meals.filter(
      (meal) =>
        meal.recipe?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleWeekChange = (week: number) => {
    setSelectedWeek(week);
    const params = new URLSearchParams(searchParams.toString());
    params.set("week", week.toString());
    params.set("challenge", initialChallenge.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleChallengeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("challenge", value);
    params.set("week", selectedWeek.toString());
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="space-y-5 p-4">
      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Select
            value={initialChallenge.toString()}
            onValueChange={handleChallengeChange}
          >
            <SelectTrigger className="w-full md:w-72">
              <SelectValue placeholder="Select Challenge" />
            </SelectTrigger>
            <SelectContent>
              {challenges.map((challenge) => (
                <SelectItem key={challenge.id} value={challenge.id.toString()}>
                  {formatChallengeName(challenge)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="md:flex-1">
            <SearchBox />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap">
          {Array.from({ length: 6 }, (_, i) => i + 1).map((week) => (
            <button
              key={week}
              type="button"
              onClick={() => handleWeekChange(week)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                selectedWeek === week
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              )}
            >
              Week {week}
            </button>
          ))}
        </div>

        {initialData && weekMeals.length > 0 && (
          <button
            type="button"
            onClick={handleSelectAllWeek}
            className="text-sm font-medium text-primary hover:underline"
          >
            {allWeekSelected ? "Deselect entire week" : "Add entire week to list"}
          </button>
        )}
      </div>

      {!initialData ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
          No meal plan found for Challenge {initialChallenge}
        </div>
      ) : (
        <div className="space-y-6">
          {getWeekDays(initialData.days).map((day) => {
            const filteredMeals = filterMeals(day.meals);
            if (filteredMeals.length === 0 && searchTerm) return null;

            return (
              <section key={day.id}>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
                  {day.title}
                  {day.is_celebration_day && <span aria-hidden>🎉</span>}
                </h2>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {filteredMeals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
