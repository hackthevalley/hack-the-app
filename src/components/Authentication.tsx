/* eslint-disable react-refresh/only-export-components */
import * as jose from "jose";
import {
  useContext,
  useEffect,
  useCallback,
  useState,
  createContext,
} from "react";
import axiosInstance from "../axiosInstance";

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
      const payload = jose.decodeJwt(token);
      const scopes = Array.isArray(payload.scopes) ? payload.scopes : [];
      if (
        !scopes.includes("admin") &&
        !scopes.includes("volunteer")
      )
        throw new Error("You do not have access");
      const response = await axiosInstance.get("/account/me");
      setIsAuthenticated(true);
      setUser(response.data);
      return response.data;
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
        const response = await axiosInstance.post("/account/tokens");
        const payload = jose.decodeJwt(response.data.access_token);
        const scopes = Array.isArray(payload.scopes) ? payload.scopes : [];
        if (
          !scopes.includes("admin") &&
          !scopes.includes("volunteer")
        )
          throw new Error("You do not have access");
        localStorage.setItem("auth-token", response.data.access_token);
        const currentUser = await axiosInstance.get("/account/me");
        setUser(currentUser.data);
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
