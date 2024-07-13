import {
  Button,
  Flex,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useToast,
} from "@chakra-ui/react";
import axiosInstance from "../axiosInstance";
import { SetStateAction, useState } from "react";

interface OverrideProps {
  changePage: (pageNumber: number) => void;
}

export default function OverridePage({ changePage }: OverrideProps) {
  const toast = useToast();
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
        const response = await axiosInstance.post(
          "/api/admin/send_custom_url",
          {
            email: input,
          }
        );
        setInput("");
        toast({
          title: "Email link successfully sent",
          status: "success",
          isClosable: true,
        });
        console.log(response.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        toast({
          title: e.message || "An unknown error occured",
          status: "error",
          isClosable: true,
        });
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
        <FormControl isInvalid={isError}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={input}
            onChange={handleInputChange}
            width={"100%"}
          />
          {isError ? (
            <FormErrorMessage>Email is required.</FormErrorMessage>
          ) : (
            <></>
          )}
        </FormControl>
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
