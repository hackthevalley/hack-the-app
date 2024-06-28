/* eslint-disable @typescript-eslint/no-explicit-any */
import PropTypes from "prop-types";
import { Fragment, Suspense } from "react";
import { CgLogOut } from "react-icons/cg";
import {
  NavLink,
  Navigate,
  useLocation,
  useNavigate,
  useMatch,
} from "react-router-dom";

import {
  Button,
  HStack,
  VStack,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

import { Protected, useUser } from "./Authentication";

interface DashboardLayoutProps {
  routes: any;
  withAuth?: boolean;
  children: any;
}

export default function DashboardLayout({
  routes,
  withAuth,
  children,
}: DashboardLayoutProps) {
  const navBg = useColorModeValue("gray.200", "gray.900");
  const Component = withAuth ? Protected : Fragment;
  const location = useLocation();
  const match = useMatch(routes.to);
  const { logout } = useUser();
  const navigate = useNavigate();
  const componentProps = {
    ...(withAuth && {
      fallback: <Navigate to="/login" />,
    }),
  } as any;

  return (
    <HStack w="100%" h="100%">
      <VStack
        h="100%"
        bg={navBg}
        align="stretch"
        p="4"
        width="16rem"
        flexShrink="0"
      >
        <Text px="4" py="2" fontWeight="bold" textAlign="start">
          Hack The Back
        </Text>
        {routes.map((route: any) => {
          const isMatch = route.exact
            ? route.to === match?.pathname
            : match?.pathname.startsWith(route.to);
          return (
            <Button
              variant={isMatch ? "solid" : "ghost"}
              leftIcon={<route.icon />}
              justifyContent="start"
              key={route.label}
              fontSize="14"
              to={route.to}
              as={NavLink}
              width="full"
            >
              {route.label}
            </Button>
          );
        })}
        <Button
          marginTop="auto !important"
          leftIcon={<CgLogOut />}
          justifyContent="start"
          onClick={() => {
            logout();
            navigate(`/login?redirect=${location.pathname}`);
          }}
          fontSize="14"
          width="full"
        >
          Logout
        </Button>
      </VStack>
      <Box h="100%" flexGrow="1" overflow="auto">
        <Box p="6" py="10">
          <Component {...componentProps}>
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </Component>
        </Box>
      </Box>
    </HStack>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      to: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.func.isRequired,
      exact: PropTypes.bool,
    })
  ),
  withAuth: PropTypes.bool,
};
