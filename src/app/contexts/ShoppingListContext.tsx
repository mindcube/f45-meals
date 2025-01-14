"use client";

import React, { createContext, useContext, useState } from "react";

interface SelectedMeal {
  id: number;
  title: string;
  recipeId: number;
  defaultServings: number;
  requestedServings: number;
}

interface ShoppingListContextType {
  selectedMeals: SelectedMeal[];
  addMeal: (meal: SelectedMeal) => void;
  removeMeal: (id: number) => void;
  updateServings: (id: number, servings: number) => void;
  clearList: () => void;
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

export function ShoppingListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([]);

  const addMeal = (meal: SelectedMeal) => {
    setSelectedMeals((prev) => {
      // Don't add if already exists
      if (prev.some((m) => m.id === meal.id)) return prev;
      return [...prev, meal];
    });
  };

  const removeMeal = (id: number) => {
    setSelectedMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const updateServings = (id: number, servings: number) => {
    setSelectedMeals((prev) =>
      prev.map((meal) =>
        meal.id === id ? { ...meal, requestedServings: servings } : meal
      )
    );
  };

  const clearList = () => {
    setSelectedMeals([]);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        selectedMeals,
        addMeal,
        removeMeal,
        updateServings,
        clearList,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error(
      "useShoppingList must be used within a ShoppingListProvider"
    );
  }
  return context;
}
