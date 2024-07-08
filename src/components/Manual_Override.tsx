import { Navigate } from "react-router-dom";

import { useUser } from "./Authentication";
import { Button, Flex, Text } from "@chakra-ui/react";

interface OverrideProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function OverridePage({ setPage }: OverrideProps) {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated && !import.meta.env.DEV) {
    return <Navigate to="/login" />;
  }
  return (
    <Flex
      style={{
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        margin: "16px",
        gap: "24px",
      }}
    >
      <Text textAlign="center">Manual Override Page here</Text>
      <Button width="50%" onClick={() => setPage(0)}>
        Back to scanner
      </Button>
    </Flex>
  );
}
