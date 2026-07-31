import { useState } from "react";

function AiTutorButton() {
  const [open, setOpen] = useState(false);

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
          <h3>AI Tutor</h3>

          <p>
            🚧 This feature is under development and will be available
            in a future update.
          </p>

          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}

export default AiTutorButton;
