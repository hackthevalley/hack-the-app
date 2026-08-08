import axiosInstance from "../axiosInstance";

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AccountUser {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

export async function createSession(email: string, password: string) {
  const formData = new URLSearchParams({ username: email, password });
  const response = await axiosInstance.post<TokenResponse>(
    "/account/sessions",
    formData.toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
  return response.data;
}

export async function refreshSession() {
  const response = await axiosInstance.post<TokenResponse>("/account/tokens");
  return response.data;
}

export async function getCurrentUser() {
  const response = await axiosInstance.get<AccountUser>("/account/me");
  return response.data;
}
