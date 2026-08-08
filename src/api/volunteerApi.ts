import axiosInstance from "../axiosInstance";
import type { CheckInResponse, FoodData } from "../types/volunteer";

export async function checkInApplication(id: string) {
  const response = await axiosInstance.post<CheckInResponse>(
    "/volunteer/check-ins",
    { id },
  );
  return response.data;
}

export async function getFoodSchedule() {
  const response = await axiosInstance.get<FoodData>("/volunteer/food");
  return response.data;
}

export async function trackMeals(application: string, mealIds: string[]) {
  await axiosInstance.post("/volunteer/food/tracking", {
    food: mealIds.map((serving) => ({ application, serving })),
  });
}

export async function createWalkIn(email: string) {
  const response = await axiosInstance.post<{ message?: string }>(
    "/volunteer/forms/walk-ins",
    { email },
  );
  return response.data;
}
