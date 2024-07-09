import { Button, Flex, Text } from "@chakra-ui/react";

interface OverrideProps {
  changePage: (pageNumber: number) => void;
}

export default function OverridePage({ changePage }: OverrideProps) {
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
      <Button width="50%" onClick={() => changePage(0)}>
        Back to scanner
      </Button>
    </Flex>
  );
}
