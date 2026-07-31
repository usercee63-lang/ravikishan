import { useBookmarks } from "../../hooks/useBookmarks";

function BookmarkButton({ subject, chapter, topic, title }) {
  const { bookmarked, toggle } = useBookmarks(
    subject,
    chapter,
    topic,
    title
  );

  return (
    <button
      className={`bookmark-button ${bookmarked ? "bookmarked" : ""}`}
      onClick={toggle}
      title={bookmarked ? "Remove bookmark" : "Bookmark this topic"}
    >
      {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
    </button>
  );
}

export default BookmarkButton;
