/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// import jwt from "jsonwebtoken";
import * as jose from "jose";
import PropTypes from "prop-types";
import {
  useContext,
  useEffect,
  useCallback,
  useState,
  createContext,
} from "react";
import axiosInstance from "../axiosInstance";

interface IUserContext {
  login: (token: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  user: any; // Update with actual user type if possible
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
  const [user, setUser] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("auth-token");
    setIsAuthenticated(false);
    setUser(false);
  }, []);

  const login = useCallback(async (token: string) => {
    try {
      localStorage.setItem("auth-token", token);
      const payload: any = jose.decodeJwt(token);
      if (!payload.isStaffUser) throw new Error("You do not have access");
      const response = await axiosInstance.get("/api/account/users/me");
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
        const response = await axiosInstance.post(
          "/api/account/auth/token/refresh",
          { token }
        );
        if (!response.data.payload.isStaffUser)
          throw new Error("You do not have access");
        localStorage.setItem("auth-token", response.data.token);
        setLoading(false);
        setIsAuthenticated(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        logout();
        setLoading(false);
      }
    };
    let timer: number;
    handler().then(() => {
      timer = window.setInterval(handler, 10000);
    });

    return () => {
      window.clearInterval(timer);
    };
  }, [logout]);
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      login(token)
        .then(() => setLoading(false))
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [login]);
  return (
    <UserContext.Provider
      value={{ login, logout, loading, isAuthenticated, user }}
    >
      {loading ? "Loading..." : children}
    </UserContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
