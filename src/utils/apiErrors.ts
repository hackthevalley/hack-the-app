import axios from "axios";

type ApiErrorBody = {
  detail?: string | { fallbackMessage?: string; message?: string };
  fallbackMessage?: string;
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    if (typeof body?.detail === "string" && body.detail.trim()) {
      return body.detail;
    }
    if (typeof body?.detail === "object") {
      const detailMessage = body.detail.fallbackMessage || body.detail.message;
      if (detailMessage) return detailMessage;
    }
    if (body?.fallbackMessage) return body.fallbackMessage;
    if (body?.message) return body.message;
    if (error.message) return error.message;
  }

  return error instanceof Error && error.message ? error.message : fallback;
}
