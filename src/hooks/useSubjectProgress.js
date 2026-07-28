import { useEffect, useState } from "react";
import { calculateSubjectProgress } from "../utils/progress";

export function useSubjectProgress(subject, navigation) {
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });

  useEffect(() => {
    if (!subject || !navigation) return;

    setProgress(
      calculateSubjectProgress(subject, navigation)
    );
  }, [subject, navigation]);

  return progress;
}
