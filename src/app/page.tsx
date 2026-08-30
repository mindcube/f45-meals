// app/page.tsx
import { getMealPlan, getChallenges } from "@/lib/api";
import MealPlanDisplay from "@/components/MealPlanDisplay";
import { SearchProvider } from "@/components/SearchProvider";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const searchParama = await searchParams;
  const challenge = searchParama.challenge;
  const challengeId = Number(challenge || 43);

  // Fetch challenges and meal plan in parallel
  const [challenges, mealPlan] = await Promise.allSettled([
    getChallenges(),
    getMealPlan(challengeId),
  ]);

  // Extract challenges data with fallback
  const challengesData =
    challenges.status === "fulfilled" ? challenges.value : [];

  // Extract meal plan data
  const mealPlanData = mealPlan.status === "fulfilled" ? mealPlan.value : null;

  return (
    <SearchProvider>
      <Suspense fallback={<div className="p-4 text-muted-foreground">Loading...</div>}>
        <MealPlanDisplay
          initialData={mealPlanData}
          initialChallenge={challengeId}
          challenges={challengesData}
        />
      </Suspense>
    </SearchProvider>
  );
}
