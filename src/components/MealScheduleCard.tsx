import { Box, Card, Center, Flex, SimpleGrid, Spacer, Switch, Tabs, Text } from "@chakra-ui/react";
import type { Meal } from "../types/volunteer";

const MEAL_ORDER: Record<string, number> = { Breakfast: 1, Lunch: 2, Dinner: 3 };

function groupMealsByDay(meals: Meal[]): Record<number, Meal[]> {
  return meals.reduce<Record<number, Meal[]>>((days, meal) => {
    (days[meal.day] ??= []).push(meal);
    days[meal.day].sort(
      (left, right) => (MEAL_ORDER[left.name] ?? 99) - (MEAL_ORDER[right.name] ?? 99)
    );
    return days;
  }, {});
}

export default function MealScheduleCard({
  meals,
  currentMeal,
  selectedMealIds,
  takenMealIds,
  tabIndex,
  spacing,
  background,
  textColor,
  onTabChange,
  onMealToggle,
}: {
  meals: Meal[];
  currentMeal?: Meal;
  selectedMealIds: string[];
  takenMealIds: ReadonlySet<string>;
  tabIndex: number;
  spacing: number;
  background: string;
  textColor: string;
  onTabChange: (index: number) => void;
  onMealToggle: (mealId: string) => void;
}) {
  const mealsByDay = groupMealsByDay(meals);

  return (
    <Card.Root>
      <Card.Body>
        <Box mb={spacing}>
          <Text fontSize="4xl" as="b">Meal Schedule</Text>
          <br />
          <Text as="i" fontSize={18}>
            Now Serving: {currentMeal ? `Day ${currentMeal.day} ${currentMeal.name}` : "Nothing"}
          </Text>
        </Box>

        <Tabs.Root
          lazyMount
          fitted
          variant="enclosed"
          value={`day-${tabIndex + 1}`}
          onValueChange={({ value }) => onTabChange(Number(value.replace("day-", "")) - 1)}
          width="100%"
          bg={background}
          mb={spacing}
        >
          <Tabs.List>
            {[1, 2, 3].map((day) => (
              <Tabs.Trigger key={day} value={`day-${day}`} _focus={{ boxShadow: "none" }} borderWidth="3px" color={textColor}>
                Day {day}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {[1, 2, 3].map((day) => (
            <Tabs.Content key={day} value={`day-${day}`} display="flex" flexDirection="column" alignItems="center" justifyContent="center" h="240px">
              <Center>
                <SimpleGrid columns={1} w="100%">
                  {(mealsByDay[day] ?? []).map((meal) => (
                    <Flex mb={8} key={meal.id}>
                      <Text fontSize="lg">{meal.name}</Text>
                      <Spacer />
                      <Switch.Root
                        size="lg"
                        ml={12}
                        disabled={takenMealIds.has(meal.id)}
                        checked={selectedMealIds.includes(meal.id) || takenMealIds.has(meal.id)}
                        onCheckedChange={() => onMealToggle(meal.id)}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control><Switch.Thumb /></Switch.Control>
                      </Switch.Root>
                    </Flex>
                  ))}
                </SimpleGrid>
              </Center>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Card.Body>
    </Card.Root>
  );
}
