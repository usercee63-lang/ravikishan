import katex from "katex";
import "katex/dist/katex.min.css";

function renderInlineMath(str) {
  return str.replace(/\$([^$]+)\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex, { displayMode: false, throwOnError: false });
    } catch {
      return tex;
    }
  });
}

function renderNoteLine(note, idx) {
  const trimmed = note.trim();

  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    const tex = trimmed.slice(2, -2);
    let html;
    try {
      html = katex.renderToString(tex, { displayMode: true, throwOnError: false });
    } catch {
      html = tex;
    }
    return (
      <div
        key={idx}
        className="overflow-x-auto my-2"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const isHeading = trimmed.startsWith("<h2") || trimmed.startsWith("<h3");
  const withMath = renderInlineMath(trimmed);

  return (
    <div
      key={idx}
      className={
        isHeading
          ? "mt-6 pb-1 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold"
          : "text-sm text-slate-700 dark:text-slate-300 [&_b]:font-bold [&_b]:text-slate-900 dark:[&_b]:text-white"
      }
      dangerouslySetInnerHTML={{ __html: withMath }}
    />
  );
}

export default function NotesRenderer({ notes }) {
  if (!notes || notes.length === 0) return null;

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs space-y-1">
      {notes.map((note, idx) => renderNoteLine(note, idx))}
    </div>
  );
}
