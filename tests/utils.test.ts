import assert from "node:assert/strict";
import test from "node:test";

import {
  validateRequiredEmail,
  validateRequiredPassword,
} from "../src/utils/validators.ts";
import {
  formatMeal,
  getCurrentMeal,
  getTakenMealIds,
  groupMealsByDay,
} from "../src/utils/meals.ts";

test("validates credentials without rejecting long email domains", () => {
  assert.equal(validateRequiredEmail("person@example.technology"), undefined);
  assert.equal(validateRequiredEmail("not-an-email"), "Invalid email address");
  assert.equal(validateRequiredEmail(""), "Email address is required");
  assert.equal(validateRequiredPassword(""), "Password is required");
});

test("normalizes meal data for the scanner", () => {
  const meals = [
    { id: "dinner", name: "Dinner", day: 2, serving: false },
    { id: "breakfast", name: "Breakfast", day: 2, serving: true },
  ];
  const grouped = groupMealsByDay(meals);

  assert.deepEqual(grouped[2].map((meal) => meal.id), ["breakfast", "dinner"]);
  assert.equal(
    getCurrentMeal({ allFood: meals, currentMeal: "breakfast" })?.id,
    "breakfast",
  );
  assert.equal(formatMeal(meals[1]), "Day 2 Breakfast");
  assert.deepEqual(
    [
      ...getTakenMealIds({
        id: "app",
        answers: {
          firstName: "A",
          lastName: "B",
          email: "a@example.com",
          phoneNumber: "",
          tShirtSize: "M",
          dietaryRestrictions: "",
        },
        applicant: { status: "accepted" },
        food: [{ serving: "breakfast" }, {}],
      }),
    ],
    ["breakfast"],
  );
});
