import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Center, Container, Flex, Heading } from "@chakra-ui/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import axiosInstance from "../axiosInstance";
import type { FoodData, HackerApplication } from "../types/volunteer";
import HackerDetailsCard from "./HackerDetailsCard";
import MealScheduleCard from "./MealScheduleCard";

interface HackerInfoProps {
  info: HackerApplication;
  changePage: (pageNumber: number) => void;
  food: FoodData;
  autoCheck: boolean;
}

export default function Hackerinfo({ info, changePage, food, autoCheck }: HackerInfoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "white" : "black";
  const background = isDark ? "#646973" : "#dae1eb";
  const currentMeal = food.allFood.find((meal) => meal.serving);
  const [tabIndex, setTabIndex] = useState(currentMeal ? currentMeal.day - 1 : 0);
  const takenMealIds = useMemo(
    () => new Set(info.food.flatMap((item) => item.serving ? [item.serving] : [])),
    [info.food]
  );
  const [selectedMealIds, setSelectedMealIds] = useState<string[]>(
    currentMeal && autoCheck && !takenMealIds.has(currentMeal.id) ? [currentMeal.id] : []
  );

  useEffect(() => {
    if (autoCheck && currentMeal && takenMealIds.has(currentMeal.id)) {
      toast.dismiss();
      toast.error(`Hacker has already had: Day ${currentMeal.day} ${currentMeal.name}`);
    }
  }, [autoCheck, currentMeal, takenMealIds]);

  const handleMealToggle = useCallback((mealId: string) => {
    setSelectedMealIds((selected) =>
      selected.includes(mealId)
        ? selected.filter((id) => id !== mealId)
        : [...selected, mealId]
    );
  }, []);

  const saveHackerInfo = async () => {
    const tracking = selectedMealIds.map((mealId) => ({
      application: info.id,
      serving: mealId,
    }));
    const toastId = toast.loading("Submitting...");

    try {
      await axiosInstance.post("/volunteer/food/tracking", { food: tracking });
      toast.success(tracking.length ? "Updated!" : "No changes made", { id: toastId });
      changePage(0);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.message : "Unable to update meals";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <Flex minW="100%" minH="100vh" overflowY="auto" maxH="100vh">
      <Container pb={10} minH="100vh" fontFamily="mono">
        <Box py={7} px={2} width="100%">
          <Heading as="h1" size="xl" cursor="default" mb={6} textAlign="center">
            Hi, {info.answers.firstName} {info.answers.lastName}
          </Heading>

          <HackerDetailsCard application={info} spacing={6} />
          <MealScheduleCard
            meals={food.allFood}
            currentMeal={currentMeal}
            selectedMealIds={selectedMealIds}
            takenMealIds={takenMealIds}
            tabIndex={tabIndex}
            spacing={6}
            background={background}
            textColor={textColor}
            onTabChange={setTabIndex}
            onMealToggle={handleMealToggle}
          />

          <Center mt={4} pb="96px">
            <Button
              textAlign="center"
              onClick={saveHackerInfo}
              color={textColor}
              w="50%"
              background={background}
              position="fixed"
              bottom="5%"
              left="50%"
              transform="translateX(-50%)"
              zIndex="1000"
              border="2px"
              opacity="0.85"
            >
              {selectedMealIds.length ? "Save" : "Next"}
            </Button>
          </Center>
        </Box>
      </Container>
    </Flex>
  );
}
