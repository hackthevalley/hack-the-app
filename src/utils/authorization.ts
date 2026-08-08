import * as jose from "jose";

const STAFF_SCOPES = new Set(["admin", "volunteer"]);

export function assertStaffToken(token: string): jose.JWTPayload {
  const payload = jose.decodeJwt(token);
  const scopes = Array.isArray(payload.scopes) ? payload.scopes : [];
  if (!scopes.some((scope) => typeof scope === "string" && STAFF_SCOPES.has(scope))) {
    throw new Error("You do not have access");
  }
  return payload;
}
