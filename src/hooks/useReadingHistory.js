import { useEffect } from "react";
import { saveHistory } from "../utils/history";

export function useReadingHistory(
  subject,
  chapter,
  topic,
  title
) {
  useEffect(() => {
    if (!title) return;

    saveHistory({
      subject,
      chapter,
      topic,
      title,
    });
  }, [subject, chapter, topic, title]);
}
