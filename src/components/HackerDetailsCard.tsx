import { Box, Card, Center, Flex, Grid, Spacer, Text } from "@chakra-ui/react";
import type { HackerApplication } from "../types/volunteer";

export default function HackerDetailsCard({
  application,
  spacing,
}: {
  application: HackerApplication;
  spacing: number;
}) {
  const { answers, applicant } = application;

  return (
    <>
      <Card.Root>
        <Card.Body>
          <Grid templateColumns="3fr" w="100%" mb={spacing} gap={spacing} fontSize={16}>
            <Box>
              <Text as="b">Email</Text>
              <Box borderWidth="2px" borderRadius="lg" overflow="hidden" textAlign="center" px={2}>
                {answers.email}
              </Box>
            </Box>
            <Box>
              <Text as="b">Phone Number</Text>
              <Box borderWidth="2px" borderRadius="lg" overflow="hidden" textAlign="center" px={2}>
                {answers.phoneNumber}
              </Box>
            </Box>
            <Flex>
              <Box>
                <Center><Text as="b">Status</Text></Center>
                <Box borderWidth="2px" borderRadius="lg" overflow="hidden" textAlign="center" px={2}>
                  {applicant.status}
                </Box>
              </Box>
              <Spacer />
              <Box>
                <Center><Text as="b">Size</Text></Center>
                <Box borderWidth="2px" borderRadius="lg" overflow="hidden" textAlign="center" px={2}>
                  {answers.tShirtSize}
                </Box>
              </Box>
            </Flex>
          </Grid>
        </Card.Body>
      </Card.Root>

      <Card.Root my={spacing}>
        <Card.Body>
          <Center mb={4}><Text fontSize={18} as="b">Dietary Restrictions</Text></Center>
          <Center><Text fontSize={16}>{answers.dietaryRestrictions}</Text></Center>
        </Card.Body>
      </Card.Root>
    </>
  );
}
