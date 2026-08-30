import type { Challenge } from "@/app/types/meal";

export async function getChallenges(): Promise<Challenge[]> {
  try {
    const res = await fetch(
      "https://strapi.f45training.com/challenges",
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      throw new Error("Failed to fetch challenges");
    }

    const challenges: Challenge[] = await res.json();
    // Sort by id to maintain consistent order
    return challenges.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    // Fallback to hardcoded challenges if API fails
    return Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      name: `Challenge ${i + 1}`,
      start_date: "",
      end_date: "",
      status: "ACTIVE" as const,
    }));
  }
}

export async function getMealPlan(challengeId: number = 43) {
  const res = await fetch(
    `https://strapi.f45training.com/meal-plannings?challenge.id_eq=${challengeId}&dietary_preference.id_eq=3`,
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!res.ok) {
    throw new Error("Failed to fetch meal plan");
  }

  const data = await res.json();
  return data[0];
}

export async function getRecipeDetails(recipeId: number) {
  const res = await fetch(
    `https://strapi.f45training.com/recipes/${recipeId}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recipe details");
  }

  return res.json();
}
