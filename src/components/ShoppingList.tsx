"use client";

import { useShoppingList } from "@/app/contexts/ShoppingListContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  MinusCircle,
  ShoppingCart,
  Copy,
  Share2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { convertToOunces } from "../lib/utils";
import { categorizeIngredient, CATEGORIES } from "../lib/ingredients";
import { getRecipeDetails } from "../lib/api";

interface GroupedIngredient {
  title: string;
  total: number;
  unit: string;
  recipes: string[];
  category: string;
}

export function ShoppingList() {
  const { selectedMeals, updateServings, removeMeal } = useShoppingList();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("meals");
  const [groupedIngredients, setGroupedIngredients] = useState<
    GroupedIngredient[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleServingChange = (meal: any, delta: number) => {
    const newServings = meal.requestedServings + delta;
    if (newServings > 0) {
      updateServings(meal.id, newServings);
    }
  };

  useEffect(() => {
    async function fetchAndGroupIngredients() {
      if (selectedMeals.length === 0) {
        setGroupedIngredients([]);
        return;
      }

      setIsLoading(true);
      const grouped: { [key: string]: GroupedIngredient } = {};

      try {
        // Fetch all recipes in parallel
        const recipePromises = selectedMeals.map((meal) =>
          getRecipeDetails(meal.recipeId)
        );
        const recipes = await Promise.all(recipePromises);

        recipes.forEach((recipe, index) => {
          const meal = selectedMeals[index];
          const servingMultiplier =
            meal.requestedServings / meal.defaultServings;

          recipe.recipe_data[0].ingredients.forEach((ing) => {
            const key = ing.ingredient.title.toLowerCase();
            const measurement = ing.ingredient_measurement?.abbreviation || "";
            const converted = convertToOunces(
              ing.amount * servingMultiplier,
              measurement
            );

            if (grouped[key]) {
              grouped[key].total += converted.value;
              if (!grouped[key].recipes.includes(meal.title)) {
                grouped[key].recipes.push(meal.title);
              }
            } else {
              grouped[key] = {
                title: ing.ingredient.title,
                total: converted.value,
                unit: converted.unit,
                recipes: [meal.title],
                category: categorizeIngredient(ing.ingredient.title),
              };
            }
          });
        });

        setGroupedIngredients(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }

      setIsLoading(false);
    }

    fetchAndGroupIngredients();
  }, [selectedMeals]);

  const copyToClipboard = () => {
    let text = "Shopping List\n\n";

    Object.values(CATEGORIES).forEach((category) => {
      const categoryIngredients = groupedIngredients.filter(
        (ing) => ing.category === category
      );

      if (categoryIngredients.length > 0) {
        text += `${category}:\n`;
        categoryIngredients.forEach((ing) => {
          text += `- ${ing.total.toFixed(1)} ${ing.unit} ${ing.title}\n`;
        });
        text += "\n";
      }
    });

    navigator.clipboard.writeText(text);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="default" className="fixed bottom-4 right-4 shadow-lg">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Shopping List ({selectedMeals.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping List</SheetTitle>
        </SheetHeader>

        {selectedMeals.length === 0 ? (
          <div className="py-4 text-center text-gray-500">
            Select meals to build your shopping list
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="meals">Selected Meals</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="meals" className="mt-4">
              <div className="space-y-4">
                {selectedMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{meal.title}</p>
                      <p className="text-sm text-gray-500">
                        Servings: {meal.requestedServings}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleServingChange(meal, -1)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleServingChange(meal, 1)}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeMeal(meal.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-4">
              {isLoading ? (
                <div className="py-4 text-center text-gray-500">
                  Calculating ingredients...
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.values(CATEGORIES).map((category) => {
                    const ingredients = groupedIngredients.filter(
                      (ing) => ing.category === category
                    );

                    if (ingredients.length === 0) return null;

                    return (
                      <div key={category}>
                        <h3 className="font-semibold mb-2">{category}</h3>
                        <div className="space-y-2">
                          {ingredients.map((ing) => (
                            <div
                              key={ing.title}
                              className="flex justify-between items-center"
                            >
                              <span>{ing.title}</span>
                              <span className="text-gray-600">
                                {ing.total.toFixed(1)} {ing.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {selectedMeals.length > 0 && (
          <SheetFooter className="mt-6">
            <div className="flex w-full gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={copyToClipboard}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  // TODO: Implement share functionality
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
