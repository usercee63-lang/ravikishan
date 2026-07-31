const logger = require("../utils/logger");

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";
const MAX_CONTEXT_CHARS = 8000;
const MAX_HISTORY_MESSAGES = 12;
const TIMEOUT_MS = 45000;

function buildSystemPrompt(title, notesText) {
  return {
    role: "system",
    content:
      `You are an expert AI tutor for the Ravikishan study platform, helping a Nepali Class 11/12 (NEB board) student. ` +
      `The student is currently viewing the topic "${title}". ` +
      `Use the following study notes as your primary source of truth, and answer clearly and concisely. ` +
      `Use $...$ / $$...$$ for math notation. You may answer in a mix of English and Nepali. ` +
      `If the question is outside the notes, use general physics/chemistry/maths knowledge and say so briefly.\n\n` +
      `STUDY NOTES:\n${notesText}`,
  };
}

function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}\n...[truncated]` : text;
}

async function chatWithTutor({ title, notes, messages }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    const error = new Error("AI tutor is not configured (missing OPENROUTER_API_KEY)");
    error.status = 503;
    throw error;
  }

  const notesText = truncate((notes || []).join("\n"), MAX_CONTEXT_CHARS);

  const history = (messages || []).slice(-MAX_HISTORY_MESSAGES).map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content || "").slice(0, 4000),
  }));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ravikishan.local",
        "X-Title": "Ravikishan AI Tutor",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [buildSystemPrompt(title, notesText), ...history],
        max_tokens: 1200,
        temperature: 0.6,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      let detail = `OpenRouter error ${response.status}`;

      try {
        const body = await response.json();
        if (body.error?.message) {
          detail = body.error.message;
        }
      } catch {
        // keep generic message
      }

      logger.warn("AI tutor upstream error", { status: response.status });

      const error = new Error(detail);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("AI tutor returned an empty response");
    }

    return reply;
  } catch (err) {
    if (err.name === "AbortError") {
      const timeoutError = new Error("AI tutor timed out, please try again");
      timeoutError.status = 504;
      throw timeoutError;
    }

    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  chatWithTutor,
};
