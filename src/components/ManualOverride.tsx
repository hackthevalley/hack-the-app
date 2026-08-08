import {
  Button,
  Flex,
  Text,
  Field,
  Input,
} from "@chakra-ui/react";
import { SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { createWalkIn } from "../api/volunteerApi";

interface OverrideProps {
  changePage: (pageNumber: number) => void;
}

export default function ManualOverride({ changePage }: OverrideProps) {
  const [input, setInput] = useState("");
  const [isError, setIsError] = useState(false);
  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      setIsError(false);
    }
  };
  const handleManualOverride = async () => {
    if (input != "") {
      try {
        const response = await createWalkIn(input);
        setInput("");
        toast.success(
          response.message || "Email successfully marked as walk-in"
        );
      } catch (error: unknown) {
        const detail = axios.isAxiosError<{
          detail?: string | { fallbackMessage?: string };
        }>(error)
          ? error.response?.data?.detail
          : undefined;
        toast.error(
          (typeof detail === "object" ? detail.fallbackMessage : detail) ||
            "An unknown error occurred"
        );
      }
    } else {
      setIsError(true);
    }
  };
  const handleBackButtonClick = () => {
    setInput("");
    changePage(0);
  };
  return (
    <Flex
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100svh",
        marginTop: "16px",
        marginLeft: "16px",
        marginRight: "16px",
      }}
    >
      <Flex
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          width: "100%",
        }}
      >
        <Text textAlign="center">Manual Override Page</Text>
        <Field.Root invalid={isError}>
          <Field.Label htmlFor="walk-in-email">Email</Field.Label>
          <Input
            id="walk-in-email"
            type="email"
            value={input}
            onChange={handleInputChange}
            width={"100%"}
          />
          {isError ? (
            <Field.ErrorText>Email is required.</Field.ErrorText>
          ) : (
            <></>
          )}
        </Field.Root>
        <Button width="100%" onClick={() => handleManualOverride()}>
          Submit
        </Button>
      </Flex>
      <Button
        width="100%"
        marginBottom="32px"
        onClick={() => handleBackButtonClick()}
      >
        Back to scanner
      </Button>
    </Flex>
  );
}
