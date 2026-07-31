const KEY = "study-bookmarks";

export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isBookmarked(subject, chapter, topic) {
  return getBookmarks().some(
    (item) =>
      item.subject === subject &&
      item.chapter === chapter &&
      item.topic === topic
  );
}

export function toggleBookmark(item) {
  const bookmarks = getBookmarks();

  const exists = bookmarks.find(
    (b) =>
      b.subject === item.subject &&
      b.chapter === item.chapter &&
      b.topic === item.topic
  );

  let updated;

  if (exists) {
    updated = bookmarks.filter(
      (b) =>
        !(
          b.subject === item.subject &&
          b.chapter === item.chapter &&
          b.topic === item.topic
        )
    );
  } else {
    updated = [...bookmarks, item];
  }

  localStorage.setItem(KEY, JSON.stringify(updated));

  return !exists;
}

export function removeBookmark(subject, chapter, topic) {
  const bookmarks = getBookmarks().filter(
    (b) =>
      !(
        b.subject === subject &&
        b.chapter === chapter &&
        b.topic === topic
      )
  );

  localStorage.setItem(KEY, JSON.stringify(bookmarks));
}