
import { API_BASE } from "../constants/api";
const cache = {};

export async function loadNavigation(subject) {
  if (cache[subject]) {
    return cache[subject];
  }

  const response = await fetch(
  `${API_BASE}/api/navigation/${subject}`
);
  if (!response.ok) {
    throw new Error(`Failed to load navigation: ${subject}`);
  }

  const data = await response.json();

  cache[subject] = data;

  return data;
}