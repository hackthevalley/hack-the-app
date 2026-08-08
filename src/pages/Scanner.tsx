import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";
import QrScanner from "qr-scanner";
import { Button, Text, Flex, Switch } from "@chakra-ui/react";
import ManualOverride from "../components/ManualOverride";
import HackerInfo from "../components/HackerInfo";
import type { FoodData, HackerApplication } from "../types/volunteer";
import { checkInApplication, getFoodSchedule } from "../api/volunteerApi";
import { formatMeal, getCurrentMeal } from "../utils/meals";
import { getApiErrorMessage } from "../utils/apiErrors";

const usePage = (initialValue = 0) => {
  const [page, setPage] = useState(initialValue);
  const changePage = useCallback((pageNumber: number) => setPage(pageNumber), []);

  return { page, changePage };
};

export default function Scanner() {
  const recentScansRef = useRef(new Set<string>());
  const dedupeTimersRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [info, setInfo] = useState<HackerApplication | null>(null);
  const [foodData, setFoodData] = useState<FoodData | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const [walkinCount, setWalkinCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentFood = getCurrentMeal(foodData);
  const [autoCheck, setAutoCheck] = useState<boolean>(false);
  const { page, changePage } = usePage();

  const handleScan = useCallback(async (result: QrScanner.ScanResult) => {
    if (result.data !== "") {
      const scanData = result.data;
      if (recentScansRef.current.has(scanData)) return;

      recentScansRef.current.add(scanData);
      const DEDUP_TIMEOUT_MS = 4000;
      const timer = setTimeout(() => {
        recentScansRef.current.delete(scanData);
        dedupeTimersRef.current.delete(timer);
      }, DEDUP_TIMEOUT_MS);
      dedupeTimersRef.current.add(timer);

      const toastId = toast.loading("Admitting...");
      try {
        const data = await checkInApplication(result.data);
        setInfo(data.body);
        setScanCount(data.scannedCount);
        setWalkinCount(data.walkinCount);
        toast.success(data.message, { id: toastId });
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Unable to admit hacker"), {
          id: toastId,
        });
      }
    }
  }, []);

  useEffect(() => {
    getFoodSchedule()
      .then((schedule) => {
        setFoodData(schedule);
      })
      .catch(() => {
        toast.error("Failed to retrieve food data");
        setFoodData(null);
      });
  }, []);

  useEffect(() => {
    if (page !== 0 || !videoRef.current) return;
    const qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScan(result),
        {
          onDecodeError: () => undefined,
          highlightScanRegion: true,
          highlightCodeOutline: false,
        }
      );
    void qrScanner.start();

    return () => {
      qrScanner.stop();
      qrScanner.destroy();
    };
  }, [handleScan, page]);

  useEffect(
    () => () => {
      for (const timer of dedupeTimersRef.current) clearTimeout(timer);
      dedupeTimersRef.current.clear();
      recentScansRef.current.clear();
    },
    []
  );

  useEffect(() => {
    if (info != null) {
      changePage(2);
    } else {
      changePage(0);
    }
  }, [changePage, info]);

  if (page === 1) {
    return <ManualOverride changePage={changePage} />;
  }

  if (page === 2 && info && foodData) {
    return (
      <HackerInfo
        autoCheck={autoCheck}
        info={info}
        changePage={changePage}
        food={foodData}
      />
    );
  }

  return (
    <Flex
      style={{
        height: "100svh",
        flexDirection: "column",
        alignItems: "center",
        marginRight: "16px",
        marginLeft: "16px",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <Flex style={{ flexDirection: "column", gap: "8px" }}>
        <Flex style={{ flexDirection: "column", gap: "8px" }}>
          <Text textAlign="center">{scanCount} hackers have scanned in!</Text>
          <Text textAlign="center">{walkinCount} hackers have walked in!</Text>
          <video
            ref={videoRef}
            style={{ width: "50vw" }}
            className="scanner-video"
          />
        </Flex>
        <Flex justifyContent="center" alignItems="center" direction="column">
          <Text> Checking Food? Currently Serving:</Text>
          <Flex>
            <Text as="span" color="green.400" fontWeight="bold">
              {formatMeal(currentFood)}
            </Text>
            <Switch.Root
              size="lg"
              disabled={!currentFood}
              defaultChecked={autoCheck}
              ml={8}
              onCheckedChange={({ checked }) => setAutoCheck(checked)}
            >
              <Switch.HiddenInput />
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Root>
          </Flex>
        </Flex>
      </Flex>
      <Button width="100%" marginBottom="16px" onClick={() => changePage(1)}>
        Haven't signed up?
      </Button>
    </Flex>
  );
}
