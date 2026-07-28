
import { API_BASE } from "../constants/api";

const cache = {};

export async function loadContent(subject, chapter, topic) {
  const key = `${subject}-${chapter}-${topic}`;

  if (cache[key]) {
    return cache[key];
  }

  const response = await fetch(
  `${API_BASE}/api/content/${subject}/${chapter}/${topic}`
);

  if (!response.ok) {
    throw new Error(
      `Failed to load content: ${subject}/${chapter}/${topic}`
    );
  }

  const data = await response.json();

  cache[key] = data;

  return data;
}
