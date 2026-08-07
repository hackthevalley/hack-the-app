/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Flex,
  Container,
  Box,
  Button,
  Card,
  Center,
  Grid,
  Heading,
  SimpleGrid,
  Spacer,
  Switch,
  Text,
  Tabs,
} from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";

type MealId = string;

// type Food = Record<MealTime, MealStatus>;

interface HackerInfoProps {
  info: any;
  changePage: any;
  food: Food;
  autoCheck: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  day: number;
  serving: boolean;
}

interface Food {
  allFood: Array<FoodItem>;
  currentMeal: string;
}

export default function Hackerinfo({
  info,
  changePage,
  food,
  autoCheck,
}: HackerInfoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const colors = isDark
    ? ["#646973", "#646973", "#646973"]
    : ["#dae1eb", "#dae1eb", "#dae1eb"];
  const takenMealIds = useMemo(
    () =>
      new Set<MealId>(
        Array.isArray(info?.food)
          ? info.food
              .map((item: { serving?: string }) => item.serving)
              .filter((mealId: string | undefined): mealId is string =>
                Boolean(mealId)
              )
          : []
      ),
    [info]
  );
  const isFoodTaken = useCallback(
    (mealId: MealId): boolean => takenMealIds.has(mealId),
    [takenMealIds]
  );
  const textColor = isDark ? "white" : "black";
  const bgColor = isDark ? "#646973" : "#dae1eb";
  const currentFood = food.allFood.find((f) => f.serving);
  const [tabIndex, setTabIndex] = useState(
    currentFood ? currentFood.day - 1 : 0
  );
  const bg = colors[tabIndex];
  const [displayMeals, setDisplayMeals] = useState<Array<MealId>>(
    currentFood && autoCheck && !isFoodTaken(currentFood?.id)
      ? [currentFood.id]
      : []
  );
  const spacing = 6;

  useEffect(() => {
    if (autoCheck && currentFood && isFoodTaken(currentFood.id)) {
      toast.dismiss();
      toast.error(
        "Hacker has already had: Day " +
          currentFood.day +
          " " +
          currentFood.name
      );
    }
  }, [autoCheck, currentFood, isFoodTaken]);

  const handleSwitchChange = (mealId: MealId) => {
    // This method adds food items to displayMeal array when switch is turned on (aka when user eats a meal, this meal is added to displayMeal)
    // All items in this displayMeal array will be send to backend to be removed
    // check if mealTime exists, if exists, remove from list, if dont exist, add to list
    const index = displayMeals.indexOf(mealId);
    if (index != -1) {
      // index exists, then remove it
      setDisplayMeals(
        displayMeals.filter((item) => item !== displayMeals[index])
      );
    } else {
      // index does not exist, add to list
      setDisplayMeals([...displayMeals, mealId]);
    }
  };

  // This takes all the food and groups them by day (E.g. day1 groups up dinner only, day2 groups up breakfast, lunch, dinner, day3 groups up breakfast only)
  const groupFoodByDay = () => {
    const dayForFood: Record<number, FoodItem[]> = {};
    const mealOrder = {
      Breakfast: 1,
      Lunch: 2,
      Dinner: 3,
    };

    for (const item of food.allFood) {
      if (item.day in dayForFood) {
        dayForFood[item.day].push(item);
      } else {
        dayForFood[item.day] = [item];
      }
    }
    for (const day in dayForFood) {
      dayForFood[day] = dayForFood[day].sort((a, b) => {
        return (
          mealOrder[a.name as keyof typeof mealOrder] -
          mealOrder[b.name as keyof typeof mealOrder]
        );
      });
    }
    return dayForFood;
  };

  const saveHackerInfo = async () => {
    // Request body for /volunteer/food/tracking
    const food = [];
    for (const item of displayMeals) {
      food.push({
        application: info.id, // hacker id (application_id)
        serving: item, // meal_id for each meal had
      });
    }

    const toastId = toast.loading("Submitting...");
    try {
      await axiosInstance.post("/volunteer/food/tracking", {
        food: food,
      });
      toast.success(food?.length ? "Updated!" : "No changes made", {
        id: toastId,
      });
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
    changePage(0);
  };

  return (
    <Flex minW="100%" minH="100vh" overflowY="auto" maxH="100vh">
      <Container pb={10} minH="100vh" fontFamily="mono">
        {info ? (
          <div>
            <Box py={7} px={2} width="100%">
              <Heading
                as="h1"
                size="xl"
                cursor="default"
                mb={spacing}
                textAlign="center"
              >
                Hi, {info.answers.firstName + " " + info.answers.lastName}
              </Heading>

              <Card.Root>
                <Card.Body>
                  <Grid
                    templateColumns="3fr"
                    w="100%"
                    mb={spacing}
                    gap={spacing}
                    fontSize={16}
                    // px={1}
                  >
                    <Box>
                      <Text as="b">Email</Text>
                      <Box
                        borderWidth="2px"
                        borderRadius="lg"
                        overflow="hidden"
                        p="lg"
                        textAlign="center"
                        px={2}
                      >
                        {info.answers.email}
                      </Box>
                    </Box>
                    <Box>
                      <Text as="b">Phone Number</Text>
                      <Box
                        borderWidth="2px"
                        borderRadius="lg"
                        overflow="hidden"
                        textAlign="center"
                        px={2}
                      >
                        {info.answers.phoneNumber}
                      </Box>
                    </Box>
                    <Flex>
                      <Box>
                        <Center>
                          <Text as="b">Status</Text>
                        </Center>
                        <Box
                          borderWidth="2px"
                          borderRadius="lg"
                          overflow="hidden"
                          textAlign="center"
                          px={2}
                        >
                          {info.applicant.status}
                        </Box>
                      </Box>
                      <Spacer />
                      <Box>
                        <Center>
                          <Text as="b">Size</Text>
                        </Center>
                        <Box
                          borderWidth="2px"
                          borderRadius="lg"
                          overflow="hidden"
                          textAlign="center"
                          px={2}
                        >
                          {info.answers.tShirtSize}
                        </Box>
                      </Box>
                    </Flex>
                  </Grid>
                </Card.Body>
              </Card.Root>

              <Card.Root my={spacing}>
                <Card.Body>
                  <Center mb={4}>
                    <Text fontSize={18} as="b">
                      Dietary Restrictions
                    </Text>
                  </Center>
                  <Center>
                    <Text fontSize={16}>
                      {info.answers.dietaryRestrictions}
                    </Text>
                  </Center>
                </Card.Body>
              </Card.Root>

              <Card.Root>
                <Card.Body>
                  <Box mb={spacing}>
                    <Text fontSize="4xl" as="b">
                      Meal Schedule
                    </Text>
                    <br />
                    <Text as="i" fontSize={18}>
                      Now Serving:{" "}
                      {currentFood
                        ? `Day ${currentFood.day} ${currentFood.name}`
                        : "Nothing"}
                    </Text>
                    <br />
                  </Box>

                  <Tabs.Root
                    lazyMount
                    fitted
                    variant="enclosed"
                    value={`day-${tabIndex + 1}`}
                    onValueChange={({ value }) =>
                      setTabIndex(Number(value.replace("day-", "")) - 1)
                    }
                    width="100%"
                    bg={bg}
                    mb={spacing}
                  >
                    <Tabs.List>
                      {["Day 1", "Day 2", "Day 3"].map((day, index) => (
                        <Tabs.Trigger
                          value={`day-${index + 1}`}
                          key={index}
                          _focus={{ boxShadow: "none" }}
                          borderWidth="3px"
                          color={textColor}
                        >
                          {day}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>

                    {Object.values(groupFoodByDay()).map(
                        (foodItems: FoodItem[], index: number) => {
                          {
                            /* {Object.entries(groupFoodByDay()).map(
                                                ([day, foodItems]) => { */
                          }
                          return (
                            <Tabs.Content
                              value={`day-${index + 1}`}
                              display="flex"
                              flexDirection="column"
                              alignItems="center"
                              justifyContent="center"
                              h="240px"
                              key={index}
                            >
                              <Center>
                                <SimpleGrid columns={1} w="100%">
                                  {foodItems.map((foodItem: FoodItem, key) => {
                                    return (
                                      <Flex mb={8} key={key}>
                                        <Text fontSize="lg">
                                          {foodItem.name}
                                        </Text>
                                        <Spacer />
                                        <Switch.Root
                                          size="lg"
                                          ml={12}
                                          disabled={isFoodTaken(foodItem.id)}
                                          defaultChecked={
                                            (foodItem.id === currentFood?.id &&
                                              autoCheck) ||
                                            isFoodTaken(foodItem.id)
                                          }
                                          onCheckedChange={() =>
                                            handleSwitchChange(foodItem.id)
                                          }
                                        >
                                          <Switch.HiddenInput />
                                          <Switch.Control>
                                            <Switch.Thumb />
                                          </Switch.Control>
                                        </Switch.Root>
                                      </Flex>
                                    );
                                  })}
                                </SimpleGrid>
                              </Center>
                            </Tabs.Content>
                          );
                        }
                      )}
                  </Tabs.Root>
                </Card.Body>
              </Card.Root>

              <Center mt={4}>
                <Button
                  textAlign="center"
                  onClick={saveHackerInfo}
                  color={textColor}
                  w="50%"
                  background={bgColor}
                  position="fixed"
                  bottom="5%"
                  left="50%" // Position at the horizontal middle but does not account for button's width
                  transform="translateX(-50%)" // shift the button by half of the button's width to left
                  zIndex="1000"
                  border="2px"
                  opacity="0.85"
                >
                  {displayMeals?.length ? "Save" : "Next"}
                </Button>
              </Center>

              {/* Add these breaks to make room for save button when fully scrolled down */}
              <br />
              <br />
            </Box>
          </div>
        ) : (
          <Text fontSize="lg">Loading...</Text>
        )}
      </Container>
    </Flex>
  );
}
