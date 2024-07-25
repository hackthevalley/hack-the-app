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

type MealTime =
  | "Day 1 Dinner"
  | "Day 2 Breakfast"
  | "Day 2 Lunch"
  | "Day 2 Dinner"
  | "Day 3 Breakfast"
  | "Day 3 Lunch";
type MealStatus = { received: boolean };

type DisplayMeals = Record<MealTime, MealStatus>;
// type Food = Record<MealTime, MealStatus>;

export default function Hackerinfo() {
  const colors = useColorModeValue(
    ["#FF5733", "#C70039", "#900C3F"], // Light mode colors
    ["#0F8767", "#2F52C2", "#00635D"] // Dark mode colors
  );

  const [displayMeals, setDisplayMeals] = useState<DisplayMeals>({
    "Day 1 Dinner": { received: false },
    "Day 2 Breakfast": { received: false },
    "Day 2 Lunch": { received: false },
    "Day 2 Dinner": { received: false },
    "Day 3 Breakfast": { received: false },
    "Day 3 Lunch": { received: false },
  });

  const handleSwitchChange = (mealTime: MealTime) => {
    setDisplayMeals((prev) => ({
      ...prev,
      [mealTime]: {
        ...prev[mealTime],
        received: !prev[mealTime].received,
      },
    }));
  };

  const backend = {
    hacker_id: "weofowudytuifdjsafn",
    name: "John Doe",
    email: "test@gmail.com",
    tshirt_size: "M",
    dietary_restrictions: "vegetarian, gluten free",
    current_meal: "Day 2 Lunch",
    is_walk_in: false,
    food: {
      "Day 1 Dinner": { received: false },
      "Day 2 Breakfast": { received: true },
      "Day 2 Lunch": { received: true },
      "Day 2 Dinner": { received: false },
      "Day 3 Breakfast": { received: false },
      "Day 3 Lunch": { received: false },
    },
  };

  const compareMealChange = () => {
    const displayKey = Object.keys(displayMeals) as MealTime[];

    for (const key of displayKey) {
      if (displayMeals[key].received !== backend.food[key].received) {
        backend.food[key].received = displayMeals[key].received;
      }
    }
  };

  const [tabIndex, setTabIndex] = useState(0);
  const bg = colors[tabIndex];
  const spacing = 6;

  return (
    <Flex minW="100%" minH="100%" justifyContent="center" alignItems="center">
      <Container py={10}>
        {backend ? (
          <div>
            <Box padding={7} width="100%">
              <Heading
                as="h1"
                size="xl"
                cursor="default"
                mb={spacing}
                textAlign="center"
              >
                Hi, {backend.name}
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
                    {backend.email}
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
                    {backend.tshirt_size}
                  </Box>
                </Box>
              </HStack>

              <Box mb={spacing}>
                <Text as="b">Dietary Restrictions</Text>
                <Text>{backend.dietary_restrictions}</Text>
              </Box>

              <Box mb={spacing}>
                <Text fontSize="4xl" as="b">
                  Meal Schedule
                </Text>
                <br />
                <Text as="i">Now Serving: {backend.current_meal}</Text>
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
                  <Tab _focus={{ boxShadow: "none" }} borderWidth="3px">
                    Day1
                  </Tab>
                  <Tab _focus={{ boxShadow: "none" }} borderWidth="3px">
                    Day2
                  </Tab>
                  <Tab _focus={{ boxShadow: "none" }} borderWidth="3px">
                    Day3
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel h="240">
                    <SimpleGrid
                      columns={2}
                      spacingX="52"
                      spacing="10"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="lg">Dinner</Text>
                      <Switch
                        size="lg"
                        isDisabled={backend.food["Day 1 Dinner"].received}
                        onChange={() => handleSwitchChange("Day 1 Dinner")}
                      />
                    </SimpleGrid>
                  </TabPanel>
                  <TabPanel h="240">
                    <SimpleGrid
                      columns={2}
                      spacingX="52"
                      spacing="10"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="lg">Breakfast</Text>
                      <Switch
                        size="lg"
                        isDisabled={backend.food["Day 2 Breakfast"].received}
                        onChange={() => handleSwitchChange("Day 2 Breakfast")}
                      />
                      <Text fontSize="lg">Lunch</Text>
                      <Switch
                        size="lg"
                        isDisabled={backend.food["Day 2 Lunch"].received}
                        onChange={() => handleSwitchChange("Day 2 Lunch")}
                      />
                      <Text fontSize="lg">Dinner</Text>
                      <Switch
                        size="lg"
                        isDisabled={backend.food["Day 2 Dinner"].received}
                        onChange={() => handleSwitchChange("Day 2 Dinner")}
                      />
                    </SimpleGrid>
                  </TabPanel>
                  <TabPanel h="240">
                    <SimpleGrid
                      columns={2}
                      spacingX="52"
                      spacing="10"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="lg">Breakfast</Text>
                      <Switch
                        size="lg"
                        isDisabled={backend.food["Day 3 Breakfast"].received}
                        onChange={() => handleSwitchChange("Day 3 Breakfast")}
                      />
                      <Text fontSize="lg">Lunch</Text>
                      <Switch
                        size="lg"
                        isDisabled={backend.food["Day 3 Lunch"].received}
                        onChange={() => handleSwitchChange("Day 3 Lunch")}
                      />
                    </SimpleGrid>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Center>
                <Button textAlign="center" onClick={compareMealChange}>
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
