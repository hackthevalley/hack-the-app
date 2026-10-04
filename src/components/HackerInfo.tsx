import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { useTheme } from "next-themes";
import { trackMeals } from "../api/volunteerApi";
import type { FoodData, HackerApplication } from "../types/volunteer";
import HackerDetailsCard from "./HackerDetailsCard";
import MealScheduleCard from "./MealScheduleCard";
import { getCurrentMeal, getTakenMealIds } from "../utils/meals";
import { getApiErrorMessage } from "../utils/apiErrors";

interface HackerInfoProps {
  info: HackerApplication;
  food: FoodData | null;
  autoCheck: boolean;
  onDone: () => void;
}

export default function HackerInfo({
  info,
  food,
  autoCheck,
  onDone,
}: HackerInfoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "white" : "fg";
  const background = isDark ? "gray.600" : "gray.200";
  const currentMeal = getCurrentMeal(food);
  const [tabIndex, setTabIndex] = useState(currentMeal ? currentMeal.day - 1 : 0);
  const takenMealIds = useMemo(() => getTakenMealIds(info), [info]);
  const [selectedMealIds, setSelectedMealIds] = useState<string[]>(
    currentMeal && autoCheck && !takenMealIds.has(currentMeal.id)
      ? [currentMeal.id]
      : [],
  );

  useEffect(() => {
    if (autoCheck && currentMeal && takenMealIds.has(currentMeal.id)) {
      toast.dismiss();
      toast.error(
        `Hacker has already had: Day ${currentMeal.day} ${currentMeal.name}`,
      );
    }
  }, [autoCheck, currentMeal, takenMealIds]);

  const handleMealToggle = useCallback((mealId: string) => {
    setSelectedMealIds((selected) =>
      selected.includes(mealId)
        ? selected.filter((id) => id !== mealId)
        : [...selected, mealId],
    );
  }, []);

  const saveHackerInfo = async () => {
    const toastId = toast.loading("Submitting...");

    try {
      if (selectedMealIds.length) {
        await trackMeals(info.id, selectedMealIds);
      }
      toast.success(selectedMealIds.length ? "Updated!" : "No changes made", {
        id: toastId,
      });
      onDone();
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Unable to update meals"), {
        id: toastId,
      });
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
          {food ? (
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
          ) : (
            <Text textAlign="center" color="fg.muted">
              Meal tracking is unavailable. Check-in details are still shown.
            </Text>
          )}

          <Center mt={6}>
            <Button
              textAlign="center"
              onClick={saveHackerInfo}
              color={textColor}
              w={{ base: "100%", md: "50%" }}
              background={background}
              border="2px"
            >
              {selectedMealIds.length ? "Save" : "Next"}
            </Button>
          </Center>
        </Box>
      </Container>
    </Flex>
  );
}
