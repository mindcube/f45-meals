import { getRecipeDetails } from "@/lib/api";
import { RecipeView } from "./components/RecipeView";
import { notFound } from "next/navigation";

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const recipe = await getRecipeDetails(parseInt(params.id));

    return (
      <main className="container mx-auto p-4">
        <RecipeView recipe={recipe} />
      </main>
    );
  } catch {
    notFound();
  }
}
