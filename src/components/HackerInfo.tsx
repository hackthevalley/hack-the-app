/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
    Flex,
    Container,
    Box,
    Center,
    Heading,
    SimpleGrid,
    Switch,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useColorModeValue,
    HStack,
    Button,
} from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";

type MealId = string;

// type Food = Record<MealTime, MealStatus>;

interface HackerInfoProps {
    info: any;
    changePage: any;
    food: Food;
}

interface FoodItem {
    id: string;
    name: string;
    day: number;
    endTime: string;
}

interface Food {
    allFood: Array<FoodItem>;
    currentMeal: string;
}

export default function Hackerinfo({
    info,
    changePage,
    food,
}: HackerInfoProps) {
    const colors = useColorModeValue(
        ["#FF5733", "#C70039", "#900C3F"], // Light mode colors
        ["#0F8767", "#2F52C2", "#00635D"] // Dark mode colors
    );

    const [displayMeals, setDisplayMeals] = useState<Array<MealId>>([]);

    const handleSwitchChange = (mealId: MealId) => {
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

    const groupFoodByDay = () => {
        const dayForFood: Record<number, FoodItem[]> = {};
        console.log(food.allFood);
        for (const item of food.allFood) {
            if (item.day in dayForFood) {
                dayForFood[item.day].push(item);
            } else {
                dayForFood[item.day] = [item];
            }
        }
        console.log(dayForFood);
        return dayForFood;
    };

    const isFoodTaken = (mealId: MealId): boolean => {
        for (const item of info.food) {
            if (item.serving === mealId) {
                return true;
            }
        }
        return false;
    };
    // const compareFood = {};

    const [tabIndex, setTabIndex] = useState(0);
    const bg = colors[tabIndex];
    const spacing = 6;

    return (
        <Flex
            minW="100%"
            minH="100%"
            justifyContent="center"
            alignItems="center"
        >
            <Container py={10}>
                {info ? (
                    <div>
                        <Box padding={7} width="100%">
                            <Heading
                                as="h1"
                                size="xl"
                                cursor="default"
                                mb={spacing}
                                textAlign="center"
                            >
                                Hi,{" "}
                                {info.answers.firstName +
                                    " " +
                                    info.answers.lastName}
                            </Heading>

                            <HStack mb={spacing} spacing="auto">
                                <Box>
                                    <Text as="b">Email</Text>
                                    <Box
                                        borderWidth="3px"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        p="lg"
                                        textAlign="center"
                                    >
                                        {info.answers.email}
                                    </Box>
                                </Box>
                                <Box>
                                    <Text as="b">Size</Text>
                                    <Box
                                        borderWidth="3px"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        textAlign="center"
                                    >
                                        {info.answers.tShirtSize}
                                    </Box>
                                </Box>
                            </HStack>

                            <Box mb={spacing}>
                                <Text as="b">Dietary Restrictions</Text>
                                <Text>{info.answers.dietaryRestrictions}</Text>
                            </Box>

                            <Box mb={spacing}>
                                <Text fontSize="4xl" as="b">
                                    Meal Schedule
                                </Text>
                                <br />
                                <Text as="i">
                                    Now Serving: {food.currentMeal ?? "Nothing"}
                                </Text>
                                <br />
                            </Box>

                            <Tabs
                                isManual
                                isFitted
                                variant="enclosed"
                                onChange={(index) => setTabIndex(index)}
                                bg={bg}
                                mb={spacing}
                            >
                                <TabList>
                                    <Tab
                                        _focus={{ boxShadow: "none" }}
                                        borderWidth="3px"
                                    >
                                        Day1
                                    </Tab>
                                    <Tab
                                        _focus={{ boxShadow: "none" }}
                                        borderWidth="3px"
                                    >
                                        Day2
                                    </Tab>
                                    <Tab
                                        _focus={{ boxShadow: "none" }}
                                        borderWidth="3px"
                                    >
                                        Day3
                                    </Tab>
                                </TabList>

                                <TabPanels>
                                    {Object.entries(groupFoodByDay()).map(
                                        ([day, foodItems]) => {
                                            return (
                                                <TabPanel h="240">
                                                    <SimpleGrid
                                                        columns={2}
                                                        spacingX="52"
                                                        spacing="10"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        {foodItems.map(
                                                            (foodItem) => {
                                                                return (
                                                                    <div>
                                                                        <Text fontSize="lg">
                                                                            {
                                                                                foodItem.name
                                                                            }
                                                                        </Text>
                                                                        <Switch
                                                                            size="lg"
                                                                            isDisabled={isFoodTaken(
                                                                                foodItem.id
                                                                            )}
                                                                            onChange={() =>
                                                                                handleSwitchChange(
                                                                                    foodItem.id
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </SimpleGrid>
                                                </TabPanel>
                                            );
                                        }
                                    )}
                                </TabPanels>
                            </Tabs>

                            <Center>
                                {/* <Button
                                    textAlign="center"
                                    onClick={compareMealChange}
                                >
                                    Save
                                </Button> */}
                            </Center>
                        </Box>
                    </div>
                ) : (
                    <Text fontSize="lg">Loading...</Text>
                )}
            </Container>
        </Flex>
    );
}
