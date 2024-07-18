import { Flex, Container } from '@chakra-ui/react';

import HackerAbout from '../components/HackerAbout';

export default function HackerInfo() {
  return (
    <Flex minW="100%" minH="100%" justifyContent="center" alignItems="center">
      <Container>
        <HackerAbout />
      </Container>
    </Flex>
  );
}
