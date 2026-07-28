import { useEffect, useState } from "react";
import {
  getTopicProgress,
  setTopicProgress,
} from "../utils/progress";

export function useProgress(subject, chapter, topic) {
  const [status, setStatus] = useState("not-started");

  useEffect(() => {
    if (!subject || !chapter || !topic) return;

    setStatus(
      getTopicProgress(subject, chapter, topic)
    );
  }, [subject, chapter, topic]);

  function updateStatus(newStatus) {
    setTopicProgress(
      subject,
      chapter,
      topic,
      newStatus
    );

    setStatus(newStatus);
  }

  return {
    status,
    updateStatus,
  };
}
