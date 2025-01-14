// app/page.tsx
import { getMealPlan } from "@/lib/api";
import MealPlanDisplay from "@/components/MealPlanDisplay";
import { SearchProvider } from "@/components/SearchProvider";
import { Suspense } from "react";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: PageProps) {
  const searchParama = await searchParams;
  const challenge = searchParama.challenge;
  const challengeId = Number(challenge || 43);

  try {
    const mealPlan = await getMealPlan(challengeId);
    return (
      <main className="container mx-auto p-4">
        <SearchProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <MealPlanDisplay
              initialData={mealPlan || null}
              initialChallenge={challengeId}
            />
          </Suspense>
        </SearchProvider>
      </main>
    );
  } catch {
    return (
      <main className="container mx-auto p-4">
        <SearchProvider>
          <MealPlanDisplay initialData={null} initialChallenge={challengeId} />
        </SearchProvider>
      </main>
    );
  }
}
