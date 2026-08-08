import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL = import.meta.env.VITE_HTB_API;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshRequest: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshRequest) return refreshRequest;
  refreshRequest = (async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) throw new Error("No session to refresh");
    const response = await axios.post<{ access_token: string }>(
      `${API_BASE_URL}/account/tokens`,
      undefined,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    localStorage.setItem("auth-token", response.data.access_token);
    return response.data.access_token;
  })().finally(() => {
    refreshRequest = null;
  });
  return refreshRequest;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    const isAuthEndpoint =
      request?.url?.includes("/account/sessions") ||
      request?.url?.includes("/account/tokens");
    if (error.response?.status !== 401 || !request || request._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      request.headers.Authorization = `Bearer ${await refreshAccessToken()}`;
      return await axiosInstance(request);
    } catch (refreshError) {
      window.dispatchEvent(new Event("auth:unauthorized"));
      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
