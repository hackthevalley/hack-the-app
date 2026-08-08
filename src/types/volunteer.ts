export interface Meal {
  id: string;
  name: string;
  day: number;
  serving: boolean;
}

export interface FoodData {
  allFood: Meal[];
  currentMeal: string;
}

export interface HackerApplication {
  id: string;
  answers: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    tShirtSize: string;
    dietaryRestrictions: string;
  };
  applicant: {
    status: string;
  };
  food: Array<{ serving?: string }>;
}

export interface CheckInResponse {
  body: HackerApplication;
  scannedCount: number;
  walkinCount: number;
  message: string;
}
