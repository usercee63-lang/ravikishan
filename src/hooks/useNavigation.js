import { useEffect, useState } from "react";
import { loadNavigation } from "../services/loadNavigation";

export function useNavigation(subject) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subject) return;

    async function fetchNavigation() {
      try {
        setLoading(true);
        setError(null);

        const result = await loadNavigation(subject);

        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNavigation();
  }, [subject]);

  return {
    data,
    loading,
    error,
  };
}
