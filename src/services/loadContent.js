
import { API_BASE } from "../constants/api";

const FALLBACK_BASE = "http://localhost:5000";

const cache = {};

async function fetchContent(base, subject, chapter, topic) {
  const response = await fetch(
    `${base}/api/content/${subject}/${chapter}/${topic}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load content: ${subject}/${chapter}/${topic}`
    );
  }

  return response.json();
}

export async function loadContent(subject, chapter, topic) {
  const key = `${subject}-${chapter}-${topic}`;

  if (cache[key]) {
    return cache[key];
  }

  let data;

  try {
    data = await fetchContent(API_BASE, subject, chapter, topic);
  } catch (err) {
    if (API_BASE === FALLBACK_BASE) {
      throw err;
    }

    data = await fetchContent(FALLBACK_BASE, subject, chapter, topic);
  }

  cache[key] = data;

  return data;
}
