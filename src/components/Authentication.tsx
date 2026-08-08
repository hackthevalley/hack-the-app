/* eslint-disable react-refresh/only-export-components */
import {
  useContext,
  useEffect,
  useCallback,
  useState,
  createContext,
} from "react";
import { getCurrentUser, refreshSession } from "../api/authApi";
import { assertStaffToken } from "../utils/authorization";

interface IUserContext {
  login: (token: string) => Promise<unknown>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  user: unknown;
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
  const [user, setUser] = useState<unknown>(null);

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
      } catch (err) {
        console.error(err);
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
      {loading ? "Loading..." : children}
    </UserContext.Provider>
  );
}
