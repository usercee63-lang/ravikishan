import { useEffect, useRef, useState } from "react";

import { askAiTutor } from "../services/aiService";

function AiTutorButton({ content }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();

    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await askAiTutor({
        title: content?.title || "Study topic",
        notes: content?.notes || [],
        messages: nextMessages,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className="ai-tutor-button"
        onClick={() => setOpen(!open)}
      >
        🤖 Ask AI Tutor
      </button>

      {open && (
        <div className="ai-tutor-panel">
          <div className="ai-tutor-header">
            <h3>🤖 AI Tutor</h3>

            <button
              className="ai-tutor-close"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div
            className="ai-tutor-messages"
            ref={scrollRef}
          >
            {messages.length === 0 && !error && (
              <p className="ai-tutor-hint">
                Ask me anything about{" "}
                <strong>{content?.title || "this topic"}</strong> — I have
                the study notes loaded and can explain, give examples or
                solve numericals.
              </p>
            )}

            {messages.map((message, i) => (
              <div
                key={i}
                className={`ai-tutor-message ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="ai-tutor-message assistant typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            {error && <p className="ai-tutor-error">{error}</p>}
          </div>

          <div className="ai-tutor-input-row">
            <input
              className="ai-tutor-input"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              disabled={loading}
            />

            <button
              className="ai-tutor-send"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AiTutorButton;
