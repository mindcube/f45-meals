import { getRecipeDetails } from "@/lib/api";
import { RecipeView } from "./components/RecipeView";
import { notFound } from "next/navigation";

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const recipe = await getRecipeDetails(parseInt(id));

    return (
      <div className="p-4">
        <RecipeView recipe={recipe} />
      </div>
    );
  } catch {
    notFound();
  }
}
