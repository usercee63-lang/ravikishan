import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const percent =
        docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setProgress(percent);
    }

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50"
    >
      <div
        className="h-full bg-indigo-600 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
