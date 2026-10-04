import {
  Button,
  Flex,
  Text,
  Field,
  Input,
} from "@chakra-ui/react";
import { useState, type ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { createWalkIn } from "../api/volunteerApi";
import { getApiErrorMessage } from "../utils/apiErrors";
import { validateRequiredEmail } from "../utils/validators";

export default function ManualOverride({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [isError, setIsError] = useState(false);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      setIsError(false);
    }
  };
  const handleManualOverride = async () => {
    const validationError = validateRequiredEmail(input.trim());
    if (!validationError) {
      try {
        const response = await createWalkIn(input.trim());
        setInput("");
        toast.success(
          response.message || "Email successfully marked as walk-in"
        );
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "An unknown error occurred"));
      }
    } else {
      setIsError(true);
    }
  };
  const handleBackButtonClick = () => {
    setInput("");
    onBack();
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
            <Field.ErrorText>Enter a valid email address.</Field.ErrorText>
          ) : (
            <></>
          )}
        </Field.Root>
        <Button width="100%" onClick={() => void handleManualOverride()}>
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
