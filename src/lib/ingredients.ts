// app/lib/ingredients.ts

// Basic ingredient categories
export const CATEGORIES = {
  PROTEIN: "Proteins",
  VEGETABLE: "Vegetables",
  FRUIT: "Fruits",
  DAIRY: "Dairy",
  GRAIN: "Grains",
  SPICE: "Spices & Seasonings",
  CONDIMENT: "Condiments & Sauces",
  OIL: "Oils & Fats",
  NUT: "Nuts & Seeds",
  OTHER: "Other",
} as const;

// Simple categorization based on common ingredients
export function categorizeIngredient(title: string): string {
  const lowerTitle = title.toLowerCase();

  // Proteins
  if (
    lowerTitle.includes("chicken") ||
    lowerTitle.includes("beef") ||
    lowerTitle.includes("pork") ||
    lowerTitle.includes("fish") ||
    lowerTitle.includes("salmon") ||
    lowerTitle.includes("tuna") ||
    lowerTitle.includes("shrimp") ||
    lowerTitle.includes("tofu") ||
    lowerTitle.includes("eggs") ||
    lowerTitle.includes("turkey") ||
    lowerTitle.includes("lamb") ||
    lowerTitle.includes("protein") ||
    lowerTitle.includes("tempeh") ||
    lowerTitle.includes("seitan")
  ) {
    return CATEGORIES.PROTEIN;
  }

  // Dairy
  if (
    lowerTitle.includes("milk") ||
    lowerTitle.includes("cheese") ||
    lowerTitle.includes("yogurt") ||
    lowerTitle.includes("cream") ||
    lowerTitle.includes("butter") ||
    lowerTitle.includes("curd") ||
    lowerTitle.includes("whey") ||
    lowerTitle.includes("ricotta") ||
    lowerTitle.includes("mozzarella") ||
    lowerTitle.includes("parmesan") ||
    lowerTitle.includes("feta")
  ) {
    return CATEGORIES.DAIRY;
  }

  // Grains
  if (
    lowerTitle.includes("rice") ||
    lowerTitle.includes("bread") ||
    lowerTitle.includes("pasta") ||
    lowerTitle.includes("flour") ||
    lowerTitle.includes("oat") ||
    lowerTitle.includes("quinoa") ||
    lowerTitle.includes("barley") ||
    lowerTitle.includes("couscous") ||
    lowerTitle.includes("tortilla") ||
    lowerTitle.includes("cereal") ||
    lowerTitle.includes("wheat") ||
    lowerTitle.includes("noodle")
  ) {
    return CATEGORIES.GRAIN;
  }

  // Spices & Seasonings
  if (
    lowerTitle.includes("salt") ||
    lowerTitle.includes("pepper") ||
    lowerTitle.includes("spice") ||
    lowerTitle.includes("herb") ||
    lowerTitle.includes("powder") ||
    lowerTitle.includes("seasoning") ||
    lowerTitle.includes("cumin") ||
    lowerTitle.includes("coriander") ||
    lowerTitle.includes("cinnamon") ||
    lowerTitle.includes("garlic") ||
    lowerTitle.includes("ginger") ||
    lowerTitle.includes("turmeric") ||
    lowerTitle.includes("basil") ||
    lowerTitle.includes("oregano") ||
    lowerTitle.includes("thyme") ||
    lowerTitle.includes("paprika") ||
    lowerTitle.includes("chili") ||
    lowerTitle.includes("curry")
  ) {
    return CATEGORIES.SPICE;
  }

  // Vegetables
  if (
    lowerTitle.includes("carrot") ||
    lowerTitle.includes("onion") ||
    lowerTitle.includes("lettuce") ||
    lowerTitle.includes("tomato") ||
    lowerTitle.includes("potato") ||
    lowerTitle.includes("broccoli") ||
    lowerTitle.includes("spinach") ||
    lowerTitle.includes("kale") ||
    lowerTitle.includes("cucumber") ||
    lowerTitle.includes("pepper") ||
    lowerTitle.includes("celery") ||
    lowerTitle.includes("cabbage") ||
    lowerTitle.includes("cauliflower") ||
    lowerTitle.includes("zucchini") ||
    lowerTitle.includes("squash") ||
    lowerTitle.includes("mushroom") ||
    lowerTitle.includes("asparagus") ||
    lowerTitle.includes("bean") ||
    lowerTitle.includes("pea") ||
    lowerTitle.includes("corn") ||
    lowerTitle.includes("eggplant") ||
    lowerTitle.includes("beetroot") ||
    lowerTitle.includes("radish")
  ) {
    return CATEGORIES.VEGETABLE;
  }

  // Fruits
  if (
    lowerTitle.includes("apple") ||
    lowerTitle.includes("banana") ||
    lowerTitle.includes("berry") ||
    lowerTitle.includes("fruit") ||
    lowerTitle.includes("orange") ||
    lowerTitle.includes("lemon") ||
    lowerTitle.includes("lime") ||
    lowerTitle.includes("mango") ||
    lowerTitle.includes("pear") ||
    lowerTitle.includes("grape") ||
    lowerTitle.includes("kiwi") ||
    lowerTitle.includes("peach") ||
    lowerTitle.includes("plum") ||
    lowerTitle.includes("pineapple") ||
    lowerTitle.includes("melon") ||
    lowerTitle.includes("avocado")
  ) {
    return CATEGORIES.FRUIT;
  }

  // Condiments & Sauces
  if (
    lowerTitle.includes("sauce") ||
    lowerTitle.includes("vinegar") ||
    lowerTitle.includes("mustard") ||
    lowerTitle.includes("ketchup") ||
    lowerTitle.includes("mayonnaise") ||
    lowerTitle.includes("dressing") ||
    lowerTitle.includes("marinade") ||
    lowerTitle.includes("syrup") ||
    lowerTitle.includes("honey") ||
    lowerTitle.includes("soy sauce") ||
    lowerTitle.includes("tamari") ||
    lowerTitle.includes("paste")
  ) {
    return CATEGORIES.CONDIMENT;
  }

  // Oils & Fats
  if (
    lowerTitle.includes("oil") ||
    lowerTitle.includes("fat") ||
    lowerTitle.includes("ghee") ||
    lowerTitle.includes("lard") ||
    lowerTitle.includes("margarine") ||
    lowerTitle.includes("coconut oil") ||
    lowerTitle.includes("olive oil") ||
    lowerTitle.includes("sesame oil")
  ) {
    return CATEGORIES.OIL;
  }

  // Nuts & Seeds
  if (
    lowerTitle.includes("nut") ||
    lowerTitle.includes("seed") ||
    lowerTitle.includes("almond") ||
    lowerTitle.includes("cashew") ||
    lowerTitle.includes("pistachio") ||
    lowerTitle.includes("walnut") ||
    lowerTitle.includes("peanut") ||
    lowerTitle.includes("sesame") ||
    lowerTitle.includes("sunflower") ||
    lowerTitle.includes("pumpkin seed") ||
    lowerTitle.includes("chia") ||
    lowerTitle.includes("flax")
  ) {
    return CATEGORIES.NUT;
  }

  return CATEGORIES.OTHER;
}
