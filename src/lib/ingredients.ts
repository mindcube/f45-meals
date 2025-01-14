// app/lib/ingredients.ts

// Basic ingredient categories
export const CATEGORIES = {
  PROTEIN: "Proteins",
  VEGETABLE: "Vegetables",
  FRUIT: "Fruits",
  DAIRY: "Dairy",
  GRAIN: "Grains",
  SPICE: "Spices & Seasonings",
  OTHER: "Other",
} as const;

// Simple categorization based on common ingredients
export function categorizeIngredient(title: string): string {
  const lowerTitle = title.toLowerCase();

  if (
    lowerTitle.includes("chicken") ||
    lowerTitle.includes("beef") ||
    lowerTitle.includes("fish") ||
    lowerTitle.includes("tofu") ||
    lowerTitle.includes("eggs")
  ) {
    return CATEGORIES.PROTEIN;
  }

  if (
    lowerTitle.includes("milk") ||
    lowerTitle.includes("cheese") ||
    lowerTitle.includes("yogurt") ||
    lowerTitle.includes("cream")
  ) {
    return CATEGORIES.DAIRY;
  }

  if (
    lowerTitle.includes("rice") ||
    lowerTitle.includes("bread") ||
    lowerTitle.includes("pasta") ||
    lowerTitle.includes("flour")
  ) {
    return CATEGORIES.GRAIN;
  }

  if (
    lowerTitle.includes("salt") ||
    lowerTitle.includes("pepper") ||
    lowerTitle.includes("spice") ||
    lowerTitle.includes("herb")
  ) {
    return CATEGORIES.SPICE;
  }

  // Add more vegetable checks
  if (
    lowerTitle.includes("carrot") ||
    lowerTitle.includes("onion") ||
    lowerTitle.includes("lettuce") ||
    lowerTitle.includes("tomato")
  ) {
    return CATEGORIES.VEGETABLE;
  }

  // Add more fruit checks
  if (
    lowerTitle.includes("apple") ||
    lowerTitle.includes("banana") ||
    lowerTitle.includes("berry") ||
    lowerTitle.includes("fruit")
  ) {
    return CATEGORIES.FRUIT;
  }

  return CATEGORIES.OTHER;
}
