import type { FoodData, HackerApplication, Meal } from "../types/volunteer";

const MEAL_ORDER: Record<string, number> = { Breakfast: 1, Lunch: 2, Dinner: 3 };
export const MEAL_DAYS = [1, 2, 3] as const;

export function getCurrentMeal(food: FoodData | null): Meal | undefined {
  return food?.allFood.find((meal) => meal.serving);
}

export function getTakenMealIds(application: HackerApplication): Set<string> {
  return new Set(
    application.food.flatMap((item) => (item.serving ? [item.serving] : [])),
  );
}

export function groupMealsByDay(meals: Meal[]): Record<number, Meal[]> {
  return meals.reduce<Record<number, Meal[]>>((days, meal) => {
    (days[meal.day] ??= []).push(meal);
    days[meal.day].sort(
      (left, right) =>
        (MEAL_ORDER[left.name] ?? 99) - (MEAL_ORDER[right.name] ?? 99),
    );
    return days;
  }, {});
}

export function formatMeal(meal: Meal | undefined): string {
  return meal ? `Day ${meal.day} ${meal.name}` : "Nothing";
}
