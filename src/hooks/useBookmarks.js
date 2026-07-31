import { useEffect, useMemo, useState } from "react";

import {
  getBookmarks,
  isBookmarked,
  removeBookmark,
  toggleBookmark,
} from "../utils/bookmark";

export function useBookmarks(subject, chapter, topic, title = "") {
  const item = useMemo(
    () => ({ subject, chapter, topic, title }),
    [subject, chapter, topic, title]
  );

  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const [bookmarked, setBookmarked] = useState(() =>
    isBookmarked(subject, chapter, topic)
  );

  useEffect(() => {
    function sync() {
      setBookmarks(getBookmarks());
      setBookmarked(isBookmarked(subject, chapter, topic));
    }

    window.addEventListener("storage", sync);

    return () => window.removeEventListener("storage", sync);
  }, [subject, chapter, topic]);

  function toggle() {
    const nowBookmarked = toggleBookmark(item);

    setBookmarked(nowBookmarked);
    setBookmarks(getBookmarks());

    return nowBookmarked;
  }

  function remove() {
    removeBookmark(subject, chapter, topic);

    setBookmarked(false);
    setBookmarks(getBookmarks());
  }

  return { bookmarks, bookmarked, toggle, remove };
}
