import { Navigate, useNavigate } from "react-router-dom";

import { useUser } from "../components/Authentication";
import { Button, Flex, Text } from "@chakra-ui/react";

export default function OverridePage() {
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
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
      <Button width="50%" onClick={() => navigate("/")}>
        Back to scanner
      </Button>
    </Flex>
  );
}
