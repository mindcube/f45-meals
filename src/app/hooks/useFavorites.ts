// app/hooks/useFavorites.ts
"use client";

import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recipe-favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("recipe-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipeId: number) => {
    setFavorites((prev) => {
      if (prev.includes(recipeId)) {
        return prev.filter((id) => id !== recipeId);
      } else {
        return [...prev, recipeId];
      }
    });
  };

  const isFavorite = (recipeId: number) => favorites.includes(recipeId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
