import { useEffect, useState } from "react";
import { loadContent } from "../services/loadContent";

export function useContent(subject, chapter, topic) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subject || !chapter || !topic) return;

    async function fetchContent() {
      try {
        setLoading(true);
        setError(null);

        const result = await loadContent(subject, chapter, topic);

        setContent(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [subject, chapter, topic]);

  return {
    content,
    loading,
    error,
  };
}
