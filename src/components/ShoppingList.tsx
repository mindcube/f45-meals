"use client";

import { useShoppingList } from "@/app/contexts/ShoppingListContext";
import { SelectedMeal } from "@/app/contexts/ShoppingListContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Minus, Plus, Share2, ShoppingCart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { convertToOunces } from "../lib/utils";
import { categorizeIngredient, CATEGORIES } from "../lib/ingredients";
import { getRecipeDetails } from "../lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GroupedIngredient {
  title: string;
  total: number;
  unit: string;
  recipes: string[];
  category: string;
}

interface RecipeGroup {
  recipeId: number;
  title: string;
  defaultServings: number;
  requestedServings: number;
  dayCount: number;
  batches: number;
  entries: SelectedMeal[];
}

function groupSelectedMealsByRecipe(meals: SelectedMeal[]): RecipeGroup[] {
  const byRecipe = new Map<number, SelectedMeal[]>();

  meals.forEach((meal) => {
    const existing = byRecipe.get(meal.recipeId) || [];
    existing.push(meal);
    byRecipe.set(meal.recipeId, existing);
  });

  return Array.from(byRecipe.entries()).map(([recipeId, entries]) => {
    const cookDays = entries.filter((entry) => !entry.leftover).length;
    return {
      recipeId,
      title: entries[0].title,
      defaultServings: entries[0].defaultServings,
      requestedServings: entries[0].requestedServings,
      dayCount: entries.length,
      // Count cook batches once; leftovers share that batch's ingredients.
      batches: Math.max(1, cookDays),
      entries,
    };
  });
}

export function ShoppingList() {
  const {
    selectedMeals,
    updateServingsByRecipeId,
    removeMealsByRecipeId,
    isOpen,
    setIsOpen,
  } = useShoppingList();
  const [activeTab, setActiveTab] = useState("meals");
  const [groupedIngredients, setGroupedIngredients] = useState<
    GroupedIngredient[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [globalMultiplier, setGlobalMultiplier] = useState(1);
  const [isDesktop, setIsDesktop] = useState(false);

  const recipeGroups = groupSelectedMealsByRecipe(selectedMeals);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const handleServingChange = (group: RecipeGroup, delta: number) => {
    const newServings = group.requestedServings + delta;
    if (newServings > 0) {
      updateServingsByRecipeId(group.recipeId, newServings);
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
      const groups = groupSelectedMealsByRecipe(selectedMeals);

      try {
        const recipes = await Promise.all(
          groups.map((group) => getRecipeDetails(group.recipeId))
        );

        recipes.forEach((recipe, index) => {
          const group = groups[index];
          const servingMultiplier =
            group.batches *
            (group.requestedServings / group.defaultServings) *
            globalMultiplier;

          recipe.recipe_data[0].ingredients.forEach(
            (ing: {
              id: number;
              amount: number;
              modifier?: string;
              ingredient: {
                id: number;
                title: string;
              } | null;
              ingredient_measurement: {
                id: number;
                title: string;
                abbreviation: string;
              };
            }) => {
              if (!ing.ingredient) return;

              const key =
                ing.ingredient.title?.toLowerCase() || "unknown ingredient";
              const measurement =
                ing.ingredient_measurement?.abbreviation || "";
              const converted = convertToOunces(
                ing.amount * servingMultiplier,
                measurement
              );

              if (grouped[key]) {
                grouped[key].total += converted.value;
                if (!grouped[key].recipes.includes(group.title)) {
                  grouped[key].recipes.push(group.title);
                }
              } else {
                grouped[key] = {
                  title: ing.ingredient.title || "Unknown Ingredient",
                  total: converted.value,
                  unit: converted.unit,
                  recipes: [group.title],
                  category: categorizeIngredient(
                    ing.ingredient.title || "Unknown"
                  ),
                };
              }
            }
          );
        });

        setGroupedIngredients(Object.values(grouped));
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }

      setIsLoading(false);
    }

    fetchAndGroupIngredients();
  }, [selectedMeals, globalMultiplier]);

  const buildListText = () => {
    let text = "Shopping List\n\n";
    if (globalMultiplier > 1) {
      text += `Quantities multiplied by ${globalMultiplier}x\n\n`;
    }

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

    return text;
  };

  const copyToClipboard = async (text = buildListText()) => {
    // navigator.clipboard is only available in secure contexts (HTTPS/localhost),
    // so fall back to a temporary textarea for LAN/HTTP access.
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // fall through to the legacy path below
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const shareList = async () => {
    const text = buildListText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "Shopping List", text });
      } catch {
        // user dismissed the share sheet
      }
    } else {
      copyToClipboard(text);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={
          isDesktop
            ? "flex h-full w-full flex-col p-0 sm:max-w-md"
            : "flex h-[90vh] flex-col rounded-t-3xl p-0"
        }
      >
        <div className="border-b border-border p-6">
          <SheetHeader>
            <div className="flex flex-col gap-4">
              <SheetTitle className="flex items-center gap-2 text-left">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Shopping List
              </SheetTitle>
              {selectedMeals.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Multiply all by:
                  </span>
                  <Select
                    value={globalMultiplier.toString()}
                    onValueChange={(value) =>
                      setGlobalMultiplier(Number(value))
                    }
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="1x" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((multiplier) => (
                        <SelectItem
                          key={multiplier}
                          value={multiplier.toString()}
                        >
                          {multiplier}x
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selectedMeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                Select meals to build your shopping list
              </p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="meals">Selected Meals</TabsTrigger>
                <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              </TabsList>

              <TabsContent value="meals" className="mt-4">
                <div className="space-y-3">
                  {recipeGroups.map((group) => (
                    <div
                      key={group.recipeId}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">{group.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {group.requestedServings} servings
                          {group.dayCount > 1
                            ? ` · covers ${group.dayCount} days`
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleServingChange(group, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleServingChange(group, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            removeMealsByRecipeId(group.recipeId)
                          }
                          className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ingredients" className="mt-4">
                {isLoading ? (
                  <div className="py-4 text-center text-muted-foreground">
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
                          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">
                            {category}
                          </h3>
                          <div className="space-y-2">
                            {ingredients.map((ing) => (
                              <div
                                key={ing.title}
                                className="flex items-center justify-between border-b border-border/60 pb-2"
                              >
                                <span>{ing.title}</span>
                                <span className="text-muted-foreground">
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
        </div>

        {selectedMeals.length > 0 && (
          <div
            className="border-t border-border p-6"
            style={{ paddingBottom: "calc(1.5rem + var(--safe-bottom))" }}
          >
            <SheetFooter>
              <div className="flex w-full gap-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => copyToClipboard()}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button className="flex-1" onClick={shareList}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
