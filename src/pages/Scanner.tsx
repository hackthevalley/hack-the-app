/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-hot-toast";
import { QrReader } from "react-qr-reader";
import axiosInstance from "../axiosInstance";

import { Button, Text, Grid, GridItem, Select, Input } from "@chakra-ui/react";

export default function Scanner() {
  const duplicates = new Set();
  const [info, setInfo] = useState<any>(null);
  const [count, setCount] = useState(0);
  const [choice, setChoice] = useState("Email");
  const quickQuestions = ["Dietary Restrictions", "T-Shirt Size"];
  const handleScan = async (result: any) => {
    if (result) {
      // dedup logic
      if (duplicates.has(result.text)) return;
      duplicates.add(result.text);
      const DEDUP_TIMEOUT_MS = 4000;
      setTimeout(() => duplicates.delete(result.text), DEDUP_TIMEOUT_MS);

      // admit
      const toastId = toast.loading("Admitting...");
      try {
        const response = await axiosInstance.post("/api/admin/qr/scan", {
          id: result.text,
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

  const handleNext = () => {
    setInfo(null);
  };
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Text textAlign="center">Total Scanned: {count} (Scan to update)</Text>
      <QrReader
        constraints={{ facingMode: "environment" }}
        onResult={handleScan}
        scanDelay={200} // ms
        containerStyle={{
          width: "100vw",
        }}
      />
      {info && (
        <>
          <Grid
            rowGap={2}
            padding="3"
            paddingTop="0"
            templateColumns="1fr 1fr 1fr"
          >
            <GridItem colSpan={1} alignSelf="center">
              <Text textAlign="center" fontSize="xs">
                Name
              </Text>
            </GridItem>
            <GridItem colSpan={2}>
              <Input isDisabled value={info.user.fullName} />
            </GridItem>
            {quickQuestions.map((question) => (
              <>
                <GridItem colSpan={1} alignSelf="center">
                  <Text textAlign="center" fontSize="xs">
                    {question}
                  </Text>
                </GridItem>
                <GridItem colSpan={2}>
                  <Input
                    isDisabled
                    value={
                      info.answers.find(
                        (item: any) => question === item.question
                      )?.answer
                    }
                  />
                </GridItem>
              </>
            ))}
            <GridItem colSpan={1}>
              <Select
                value={choice}
                onChange={(event) => setChoice(event.target.value)}
              >
                {info.answers.map((answer: any) => (
                  <option key={answer.id} value={answer.question}>
                    {answer.question}
                  </option>
                ))}
              </Select>
            </GridItem>
            <GridItem colSpan={2}>
              <Input
                isDisabled
                value={
                  info.answers.find((item: any) => choice === item.question)
                    ?.answer
                }
              />
            </GridItem>
            <GridItem colSpan={1} colStart={2}>
              <Button width="100%" onClick={handleNext}>
                Scan next
              </Button>
            </GridItem>
          </Grid>
        </>
      )}
    </div>
  );
}
