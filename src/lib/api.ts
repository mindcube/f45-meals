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
