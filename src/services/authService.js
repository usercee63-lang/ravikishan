import { API_BASE } from "../constants/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const error = new Error(
      data?.message || "Something went wrong, please try again"
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function register({ name, email, password }) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function loginWithTwoFactor({ code, tempToken }) {
  return request("/api/auth/2fa/login", {
    method: "POST",
    body: JSON.stringify({ code, tempToken }),
  });
}

export async function getMe() {
  return request("/api/auth/me");
}

export async function logout() {
  return request("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function refreshToken() {
  return request("/api/auth/refresh", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function setupTwoFactor() {
  return request("/api/auth/2fa/setup", {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function verifyTwoFactor({ code }) {
  return request("/api/auth/2fa/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function disableTwoFactor({ code }) {
  return request("/api/auth/2fa/disable", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function forgotPassword({ email }) {
  return request("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword({ token, newPassword }) {
  return request("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
