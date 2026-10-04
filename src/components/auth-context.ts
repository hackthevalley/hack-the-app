import { createContext, useContext } from "react";
import type { AccountUser } from "../api/authApi";

export interface UserContextValue {
  login: (token: string) => Promise<AccountUser>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  user: AccountUser | null;
}

export const UserContext = createContext<UserContextValue | null>(null);

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within AuthProvider");
  return context;
}
