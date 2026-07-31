import { useState } from "react";
import { calculateSubjectProgress } from "../utils/progress";

const EMPTY_PROGRESS = {
  completed: 0,
  total: 0,
  percentage: 0,
};

export function useSubjectProgress(subject, navigation) {
  const [progress, setProgress] = useState(() => {
    if (!subject || !navigation) {
      return EMPTY_PROGRESS;
    }

    return calculateSubjectProgress(subject, navigation);
  });

  const [prevKey, setPrevKey] = useState(null);

  const currentKey = subject && navigation
    ? `${subject}/${navigation.chapters?.length ?? 0}`
    : null;

  if (prevKey !== currentKey) {
    setPrevKey(currentKey);

    if (currentKey) {
      setProgress(calculateSubjectProgress(subject, navigation));
    }
  }

  return progress;
}
