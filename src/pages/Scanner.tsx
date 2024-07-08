/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import QrScanner from "qr-scanner";
import axiosInstance from "../axiosInstance";
import { Button, Text, Flex } from "@chakra-ui/react";
import { useUser } from "../components/Authentication";
import { Navigate, useNavigate } from "react-router-dom";

export default function Scanner() {
  const duplicates = new Set();
  const [info, setInfo] = useState<any>(null);
  const [count, setCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isAuthenticated } = useUser();
  const handleScan = async (result: any) => {
    if (result) {
      // dedup logic
      if (duplicates.has(result.data)) return;
      duplicates.add(result.data);
      const DEDUP_TIMEOUT_MS = 4000;
      setTimeout(() => duplicates.delete(result.data), DEDUP_TIMEOUT_MS);

      // admit
      const toastId = toast.loading("Admitting...");
      try {
        const response = await axiosInstance.post("/api/admin/qr/scan", {
          id: result.data,
        });
        const data = response.data;
        setInfo(data.body);
        setCount(data.scannedCount);
        toast.success(data.message, { id: toastId });
      } catch (error: any) {
        toast.error(error.data.fallbackMessage, { id: toastId });
      }
    }
  };

  useEffect(() => {
    let qrScanner: QrScanner | null = null;

    if (videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScan(result),
        {
          onDecodeError: () => {
            // console.error(error);
          },
          highlightScanRegion: false,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleNext = () => {
  //   setInfo(null);
  // };
  const navigate = useNavigate();
  useEffect(() => {
    console.log(info);
  }, [info]);

  if (!isAuthenticated && !import.meta.env.DEV) {
    return <Navigate to="/login" />;
  }
  return (
    <Flex
      style={{
        height: "100vh",
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
        <Text textAlign="center">
          {count} hackers have checked in! <br />
          Ready to join the excitement and <br />
          meet new people?
        </Text>
        <video
          ref={videoRef}
          style={{
            width: "50wh",
            // maxWidth: "500px",
            border: "1px solid black",
          }}
        />
      </Flex>
      <Button
        width="100%"
        marginBottom="100px"
        onClick={() => navigate("/override")}
      >
        Haven't signed up?
      </Button>
    </Flex>
  );
}
