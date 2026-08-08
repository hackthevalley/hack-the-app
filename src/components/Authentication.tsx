/* eslint-disable react-refresh/only-export-components */
import {
  useContext,
  useEffect,
  useCallback,
  useState,
  createContext,
} from "react";
import { getCurrentUser, refreshSession } from "../api/authApi";
import type { AccountUser } from "../api/authApi";
import { assertStaffToken } from "../utils/authorization";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

interface IUserContext {
  login: (token: string) => Promise<AccountUser>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  user: AccountUser | null;
}

interface IAuthProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext({} as IUserContext);

export function useUser() {
  return useContext(UserContext);
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AccountUser | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem("auth-token");
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const login = useCallback(async (token: string) => {
    try {
      localStorage.setItem("auth-token", token);
      assertStaffToken(token);
      const user = await getCurrentUser();
      setIsAuthenticated(true);
      setUser(user);
      return user;
    } catch (err) {
      localStorage.removeItem("auth-token");
      throw err;
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      toast.error("Your session expired. Please sign in again.");
      logout();
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  useEffect(() => {
    const handler = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const tokenResponse = await refreshSession();
        assertStaffToken(tokenResponse.access_token);
        localStorage.setItem("auth-token", tokenResponse.access_token);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
        setIsAuthenticated(true);
      } catch {
        toast.error("Your session expired. Please sign in again.");
        logout();
        setLoading(false);
      }
    };
    let timer: number;
    handler().then(() => {
      timer = window.setInterval(handler, 30000);
    });

    return () => {
      window.clearInterval(timer);
    };
  }, [logout]);

  return (
    <UserContext.Provider
      value={{ login, logout, loading, isAuthenticated, user }}
    >
      {loading ? (
        <Center minH="100svh">
          <VStack gap={3}>
            <Spinner size="lg" colorPalette="blue" />
            <Text color="fg.muted">Restoring your session…</Text>
          </VStack>
        </Center>
      ) : children}
    </UserContext.Provider>
  );
}

export function RequireAuth({ children }: IAuthProviderProps) {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  if (import.meta.env.DEV) return children;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
