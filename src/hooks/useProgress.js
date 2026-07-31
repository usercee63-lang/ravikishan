import { useCallback, useState } from "react";
import {
  getTopicProgress,
  setTopicProgress,
} from "../utils/progress";

export function useProgress(subject, chapter, topic) {
  const [status, setStatus] = useState(() =>
    getTopicProgress(subject, chapter, topic)
  );

  const [prevKey, setPrevKey] = useState(null);

  const currentKey = subject && chapter && topic
    ? `${subject}/${chapter}/${topic}`
    : null;

  if (prevKey !== currentKey) {
    setPrevKey(currentKey);

    if (currentKey) {
      setStatus(getTopicProgress(subject, chapter, topic));
    }
  }

  const updateStatus = useCallback(
    (newStatus) => {
      if (!subject || !chapter || !topic) return;

      setTopicProgress(subject, chapter, topic, newStatus);
      setStatus(newStatus);
    },
    [subject, chapter, topic]
  );

  return {
    status,
    updateStatus,
  };
}
