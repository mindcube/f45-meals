export interface MealPlan {
  id: number;
  days: Day[];
  dietary_preference: {
    id: number;
    title: string;
  };
}

export interface Day {
  id: number;
  title: string;
  is_celebration_day: boolean;
  meals: Meal[];
}

export interface Meal {
  id: number;
  title: string;
  leftover: boolean;
  meal_type: {
    id: number;
    title: string;
  };
  recipe: {
    id: number;
    title: string;
    serves: number;
    cook_time_in_minutes: number;
    feature_image?: {
      url: string;
    };
  };
}

export interface Recipe {
  id: number;
  title: string;
  serves: number;
  skill_level: number;
  cook_time_in_minutes: number;
  recipe_data: RecipeData[];
  feature_image?: {
    url: string;
  };
  dietary_preferences: Array<{
    id: number;
    title: string;
    description: string;
  }>;
}

export interface RecipeData {
  id: number;
  method: string;
  meal_size: string;
  ingredients: Array<{
    id: number;
    amount: number;
    modifier?: string;
    ingredient: {
      id: number;
      title: string;
    };
    ingredient_measurement: {
      id: number;
      title: string;
      abbreviation: string;
    };
  }>;
  nutrition: {
    calories_per_serve: number;
    show_chart: boolean;
    nutritional_information: {
      serving_size: number;
      nutrients: Array<{
        id: number;
        title: string;
        qty_per_serving: string;
      }>;
    };
  };
}
