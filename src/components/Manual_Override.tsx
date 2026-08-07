import {
  Button,
  Flex,
  Text,
  Field,
  Input,
} from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
import { SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";

interface OverrideProps {
  changePage: (pageNumber: number) => void;
}

export default function OverridePage({ changePage }: OverrideProps) {
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
        const response = await axiosInstance.post("/volunteer/forms/walk-ins", {
          email: input,
        });
        setInput("");
        toast.success(
          response.data.message || "Email successfully marked as walk-in"
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast.error(
          e.response?.data?.detail?.fallbackMessage ||
            e.response?.data?.detail ||
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
