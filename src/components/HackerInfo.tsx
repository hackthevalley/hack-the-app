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
import { toast } from "react-hot-toast";

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
    const [tabIndex, setTabIndex] = useState(0);
    const bg = colors[tabIndex];
    const [displayMeals, setDisplayMeals] = useState<Array<MealId>>([]);
    const spacing = 6;

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
        for (const item of food.allFood) {
            if (item.day in dayForFood) {
                dayForFood[item.day].push(item);
            } else {
                dayForFood[item.day] = [item];
            }
        }
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
    const compareMealChange = async (result: any) => {
        const toastId = toast.loading("Admitting...");
        try {
            const response = await axiosInstance.post("/api/admin/qr/scan", {
                id: result.data,
            });

            const foodResponse = await axiosInstance.get("/api/admin/food");
            const data = response.data;
            setInfo(data.body);
            toast.success(data.message, { id: toastId });
        } catch (error: any) {
            toast.error(error.data.fallbackMessage, { id: toastId });
        }

        // changePage(0);
    };

    return (
        <Flex minW="100%" minH="100vh" overflow="scroll">
            <Container pb={10} minH="100vh">
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
                            <HStack
                                mb={spacing}
                                justifyContent="space-between"
                                fontSize={18}
                            >
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

                            <Box mb={spacing} fontSize={18}>
                                <Text as="b">Dietary Restrictions</Text>
                                <Text>{info.answers.dietaryRestrictions}</Text>
                            </Box>

                            <Box mb={spacing}>
                                <Text fontSize="4xl" as="b">
                                    Meal Schedule
                                </Text>
                                <br />
                                <Text as="i" fontSize={18}>
                                    Now Serving: {food.currentMeal ?? "Nothing"}
                                </Text>
                                <br />
                            </Box>

                            <Tabs
                                isManual
                                isFitted
                                variant="enclosed"
                                onChange={(index) => setTabIndex(index)}
                                width="100%"
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
                                                <TabPanel
                                                    display="flex"
                                                    flexDirection="column"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    h="240px"
                                                >
                                                    <Center>
                                                        <SimpleGrid
                                                            // Display column is only 1 if # footItems is 1, else its 2
                                                            columns={
                                                                foodItems.length >=
                                                                2
                                                                    ? 2
                                                                    : 1
                                                            }
                                                            w="100%"
                                                            spacingX="20"
                                                        >
                                                            {foodItems.map(
                                                                (foodItem) => {
                                                                    return (
                                                                        <Box
                                                                            py={
                                                                                4
                                                                            }
                                                                            px={{
                                                                                base: "0",
                                                                                sm: "8",
                                                                                md: "8",
                                                                            }}
                                                                        >
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
                                                                        </Box>
                                                                    );
                                                                }
                                                            )}
                                                        </SimpleGrid>
                                                    </Center>
                                                </TabPanel>
                                            );
                                        }
                                    )}
                                </TabPanels>
                            </Tabs>

                            <Center>
                                <Button
                                    textAlign="center"
                                    onClick={compareMealChange}
                                >
                                    Save
                                </Button>
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
