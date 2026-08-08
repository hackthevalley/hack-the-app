import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Center minH="100svh" px={6}>
      <VStack gap={4} textAlign="center">
        <Heading size="2xl">Page not found</Heading>
        <Text color="fg.muted">The page you requested does not exist.</Text>
        <Button asChild>
          <Link to="/">Return to scanner</Link>
        </Button>
      </VStack>
    </Center>
  );
}
