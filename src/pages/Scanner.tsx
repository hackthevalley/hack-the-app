/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import QrScanner from "qr-scanner";
import axiosInstance from "../axiosInstance";
import { Button, Text, Flex, Switch } from "@chakra-ui/react";
import { useUser } from "../components/Authentication";
import { Navigate } from "react-router-dom";
import OverridePage from "../components/Manual_Override";
import HackerInfo from "../components/Hackerinfo";

const usePage = (initialValue = 0) => {
    const [page, setPage] = useState(initialValue);
    const changePage = (pageNumber: number) => setPage(pageNumber);

    return { page, changePage };
};

export default function Scanner() {
    const duplicates = new Set();
    const [info, setInfo] = useState<any>(null);
    const [foodData, setFoodData] = useState<any>(null);
    const [scanCount, setScanCount] = useState(0);
    const [walkinCount, setWalkinCount] = useState(0);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const currentFood = foodData?.allFood?.find((f: any)  => f.serving);
    const [autoCheck, setAutoCheck] = useState<boolean>(false);
    const { isAuthenticated } = useUser();
    const { page, changePage } = usePage();

    const handleScan = async (result: any) => {
        if (result && result.data != "") {
            // dedup logic
            if (duplicates.has(result.data)) return;
            duplicates.add(result.data);
            const DEDUP_TIMEOUT_MS = 4000;
            setTimeout(() => duplicates.delete(result.data), DEDUP_TIMEOUT_MS);

            // admit
            const toastId = toast.loading("Admitting...");
            try {
                const response = await axiosInstance.post(
                    "/api/admin/qr/scan",
                    {
                        id: result.data,
                    }
                );

                const data = response.data;
                setInfo(data.body);
                setScanCount(data.scannedCount);
                setWalkinCount(data.walkinCount)
                toast.success(data.message, { id: toastId });

            } catch (error: any) {
                toast.error(error?.response?.data?.fallbackMessage, { id: toastId });
            }
        }
    };

    useEffect(() => {
        axiosInstance.get("/api/admin/food")
            .then((foodResponse) => {
                setFoodData(foodResponse.data);
            })
            .catch(() => {
                toast.error("Failed to retrieve food data");
                setFoodData(null);
            })
        let qrScanner: QrScanner | null = null;
        if (videoRef.current) {
            qrScanner = new QrScanner(
                videoRef.current,
                (result) => handleScan(result),
                {
                    onDecodeError: () => {
                        // console.error(error);
                    },
                    highlightScanRegion: true,
                    highlightCodeOutline: false,
                }
            );
            qrScanner.start();
        }

        return () => {
            if (qrScanner) {
                qrScanner.stop();
                qrScanner.destroy();
            }
        };
    }, [page]);

    useEffect(() => {
        if (info != null) {
            changePage(2);
        } else {
            changePage(0);
        }
    }, [info]);

    if (!isAuthenticated && !import.meta.env.DEV) {
        return <Navigate to="/login" />;
    }

    if (page == 1) {
        return <OverridePage changePage={changePage} />;
    }

    if (page == 2) {
        return (
            <HackerInfo autoCheck={autoCheck} info={info} changePage={changePage} food={foodData} />
        );
    }

    return (
        <Flex
            style={{
                height: "100svh",
                flexDirection: "column",
                alignItems: "center",
                // marginTop: "16px",
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
                        style={{
                            width: "50wh",
                            // maxWidth: "500px",
                            border: "1px solid black",
                        }}
                    />
                </Flex>
                <Flex style={{justifyContent: 'center'}}>
                    <Text> Checking Food? Currently Serving:
                        <span style={{color: "lime", fontWeight: 'bold'}}>
                            {currentFood ? `Day ${currentFood?.day} ${currentFood?.name}`: 'Nothing'}
                        </span>
                    </Text>
                    <Switch
                        size="lg"
                        isDisabled={!currentFood}
                        defaultChecked={autoCheck}
                        ml={8}
                        onChange={() => setAutoCheck(!autoCheck)}
                    />
                </Flex>
            </Flex>
            <Button
                width="100%"
                marginBottom="16px"
                onClick={() => changePage(1)}
            >
                Haven't signed up?
            </Button>
        </Flex>
    );
}
