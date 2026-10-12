import axiosInstance, { BACKEND_URL } from "../axiosInstance";
import type {
  CheckInCounts,
  CheckInResponse,
  FoodData,
} from "../types/volunteer";

export async function checkInApplication(id: string) {
  const response = await axiosInstance.post<CheckInResponse>(
    "/volunteer/check-ins",
    { id },
  );
  return response.data;
}

export async function getCheckInCounts() {
  const response = await axiosInstance.get<CheckInCounts>(
    "/volunteer/check-ins/counts",
  );
  return response.data;
}

export async function getFoodSchedule() {
  const response = await axiosInstance.get<FoodData>("/volunteer/food");
  return response.data;
}

export async function trackMeals(application: string, mealIds: string[]) {
  await axiosInstance.post("/volunteer/food/tracking", {
    food: mealIds.map((serving) => ({ application, serving })),
  });
}

export async function createWalkIn(email: string) {
  const response = await axiosInstance.post<{ message?: string }>(
    "/volunteer/forms/walk-ins",
    { email },
  );
  return response.data;
}

export function subscribeToCheckInCounts(
  onCounts: (counts: CheckInCounts) => void,
) {
  let socket: WebSocket | undefined;
  let reconnectTimer: number | undefined;
  let authTimer: number | undefined;
  let stopped = false;

  const sendAuth = () => {
    const token = localStorage.getItem("auth-token");
    if (token && socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ token }));
    }
  };

  const connect = () => {
    const token = localStorage.getItem("auth-token");
    if (stopped || !token) return;

    const url = `${BACKEND_URL.replace(/^http/, "ws").replace(/\/+$/, "")}/api/volunteer/check-ins/live`;
    socket = new WebSocket(url);
    socket.onopen = () => {
      sendAuth();
      authTimer = window.setInterval(sendAuth, 30_000);
    };
    socket.onmessage = ({ data }) => {
      try {
        const counts = JSON.parse(data) as CheckInCounts;
        if (
          typeof counts.scannedCount === "number" &&
          typeof counts.walkinCount === "number"
        ) {
          onCounts(counts);
        }
      } catch {
        socket?.close();
      }
    };
    socket.onclose = () => {
      window.clearInterval(authTimer);
      if (!stopped) reconnectTimer = window.setTimeout(connect, 1_000);
    };
  };

  connect();
  return () => {
    stopped = true;
    window.clearTimeout(reconnectTimer);
    window.clearInterval(authTimer);
    socket?.close();
  };
}
