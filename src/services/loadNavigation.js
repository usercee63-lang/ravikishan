import { API_BASE } from "../constants/api";

const FALLBACK_BASE = "http://localhost:5000";
const cache = {};

async function fetchNavigation(base, subject) {
  const response = await fetch(`${base}/api/navigation/${subject}`);

  if (response.status === 401 || response.status === 403) {
    const error = new Error(
      response.status === 403
        ? "Your account has not been approved yet."
        : "Please log in to view this content."
    );
    error.status = response.status;
    throw error;
  }

  if (!response.ok) {
    throw new Error(`Failed to load navigation: ${subject}`);
  }

  return response.json();
}

export async function loadNavigation(subject) {
  if (cache[subject]) {
    return cache[subject];
  }

  let data;

  try {
    data = await fetchNavigation(API_BASE, subject);
  } catch (err) {
    if (err.status || API_BASE === FALLBACK_BASE) {
      throw err;
    }

    data = await fetchNavigation(FALLBACK_BASE, subject);
  }

  cache[subject] = data;

  return data;
}
