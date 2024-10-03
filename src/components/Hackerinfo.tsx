/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import {
    Flex,
    Container,
    Box,
    Button,
    Card,
    CardBody,
    Center,
    Grid,
    Heading,
    SimpleGrid,
    Spacer,
    Switch,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useColorModeValue,
} from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
import { toast } from "react-hot-toast";

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
    const colors = useColorModeValue(
        ["#dae1eb", "#dae1eb", "#dae1eb"], // Light mode colors for each tab
        ["#646973", "#646973", "#646973"] // Dark mode colors
    );
    // returns boolean if food is taken; aka mealId is in user's
    const isFoodTaken = (mealId: MealId): boolean => {
        for (const item of info.food) {
            if (item.serving === mealId) {
                return true;
            }
        }
        return false;
    };
    const textColor = useColorModeValue("black", "white"); // For light mode, text is black; for dark mode, text is white
    const bgColor = useColorModeValue("#dae1eb", "#646973");
    const currentFood = food.allFood.find(f => f.serving);
    const [tabIndex, setTabIndex] = useState(0);
    const bg = colors[tabIndex];
    const [displayMeals, setDisplayMeals] = useState<Array<MealId>>((currentFood && autoCheck && !isFoodTaken(currentFood?.id)) ? [currentFood.id]:[]);
    const spacing = 6;

    useEffect(() => {
        if (autoCheck && currentFood && isFoodTaken(currentFood.id)) {
            toast.dismiss()
            toast.error("Hacker has already had: Day " + currentFood.day + " " + currentFood.name)
        }
    }, [info])

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
        // Request body for /api/forms/foodtracker/
        const food = [];
        for(const item of displayMeals) {
            food.push({
                "application": info.id, // hacker id
                "serving": item, // servingid for each meal had
            })
        }

        const toastId = toast.loading("Submitting...");
        try {
            await axiosInstance.post(
                "/api/admin/foodtracker",
                {
                    food: food
                }
            );
            toast.success(food?.length ? "Updated!":"No changes made", { id: toastId });
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
                                Hi,{" "}
                                {info.answers.firstName +
                                    " " +
                                    info.answers.lastName}
                            </Heading>

                            <Card>
                                <CardBody>
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
                                            <Spacer/>
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
                                </CardBody>
                            </Card>

                            <Card my={spacing}>
                                <CardBody>
                                    <Center mb={4}>
                                        <Text fontSize={18} as="b">Dietary Restrictions</Text>
                                    </Center>
                                    <Center>
                                        <Text fontSize={16}>{info.answers.dietaryRestrictions}</Text>
                                    </Center>
                                </CardBody>
                            </Card>

                            <Card>
                                <CardBody>
                                    <Box mb={spacing}>
                                        <Text fontSize="4xl" as="b">
                                            Meal Schedule
                                        </Text>
                                        <br />
                                        <Text as="i" fontSize={18}>
                                            Now Serving: {currentFood ? `Day ${currentFood.day} ${currentFood.name}` : "Nothing"}
                                        </Text>
                                        <br />
                                    </Box>

                                    <Tabs
                                        isManual
                                        isFitted
                                        variant="enclosed"
                                        defaultIndex={currentFood ? currentFood.day-1:0}
                                        onChange={(index) => setTabIndex(index)}
                                        width="100%"
                                        bg={bg}
                                        mb={spacing}
                                    >
                                        <TabList>
                                            {["Day 1", "Day 2", "Day 3"].map((day, index) => (
                                                <Tab
                                                key={index}
                                                _focus={{boxShadow: "none"}}
                                                borderWidth="3px"
                                                color={textColor}
                                                >{day}</Tab>
                                            ))}
                                        </TabList>

                                        <TabPanels>
                                        {Object.values(groupFoodByDay()).map((foodItems: FoodItem[], index: number) => {
                                            {/* {Object.entries(groupFoodByDay()).map(
                                                ([day, foodItems]) => { */}
                                                    return (
                                                        <TabPanel
                                                            display="flex"
                                                            flexDirection="column"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            h="240px"
                                                            key={index}
                                                        >
                                                            <Center>
                                                                <SimpleGrid
                                                                    columns={1}
                                                                    w="100%"
                                                                >
                                                                    {foodItems.map(
                                                                        (foodItem: FoodItem, key) => {
                                                                            return (
                                                                                <Flex
                                                                                    mb={8}
                                                                                    key={key}
                                                                                >
                                                                                    <Text fontSize="lg">
                                                                                        {
                                                                                            foodItem.name
                                                                                        }
                                                                                    </Text>
                                                                                    <Spacer/>
                                                                                    <Switch
                                                                                        size="lg"
                                                                                        ml={12}
                                                                                        isDisabled={isFoodTaken(foodItem.id)}
                                                                                        defaultChecked={(foodItem.id === currentFood?.id && autoCheck) || isFoodTaken(foodItem.id)}
                                                                                        onChange={() => handleSwitchChange(foodItem.id)}
                                                                                    />
                                                                                </Flex>
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
                                </CardBody>
                            </Card>

                            <Center mt={4}>
                                <Button
                                    textAlign="center"
                                    onClick={saveHackerInfo}
                                    color={textColor}
                                    w="50%"
                                    background={bgColor}
                                    position="fixed"
                                    bottom="5%"
                                    left="50%"  // Position at the horizontal middle but does not account for button's width
                                    transform="translateX(-50%)" // shift the button by half of the button's width to left
                                    zIndex="1000"
                                    border="2px"
                                    opacity="0.85"
                                >
                                    {displayMeals?.length ? "Save":"Next"}
                                </Button>
                            </Center>

                            {/* Add these breaks to make room for save button when fully scrolled down */}
                            <br />
                            <br />
                        </Box>
                    </div>
                ) : (
                    <Text fontSize="lg" >Loading...</Text>
                )}
            </Container>
        </Flex>
    );
}
