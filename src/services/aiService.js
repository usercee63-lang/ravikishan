import { API_BASE } from "../constants/api";

export async function askAiTutor({ title, notes, messages }) {
  const response = await fetch(`${API_BASE}/api/ai/tutor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, notes, messages }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message || "AI tutor is unavailable, please try again"
    );
  }

  return data.reply;
}
