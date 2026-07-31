import { useState } from "react";
import { Link } from "react-router-dom";

import { getBookmarks, removeBookmark } from "../utils/bookmark";

function formatName(id) {
  return (id || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  function handleRemove(subject, chapter, topic) {
    removeBookmark(subject, chapter, topic);
    setBookmarks(getBookmarks());
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-page zoom">
        <div className="content-card">
          <h2>🔖 Bookmarks</h2>

          <p style={{ color: "#64748b" }}>
            You haven't bookmarked any topics yet.
          </p>

          <p style={{ color: "#64748b" }}>
            Open any topic and press the ★ Bookmark button to save it here.
          </p>

          <Link className="btn" to="/">
            Browse Subjects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page zoom">
      <div className="content-card">
        <h2>🔖 Bookmarks ({bookmarks.length})</h2>

        <div className="bookmark-list">
          {bookmarks.map((item, index) => (
            <div key={index} className="bookmark-item">
              <div className="bookmark-info">
                <span className="bookmark-subject">
                  {formatName(item.subject)} · {formatName(item.chapter)}
                </span>

                <Link
                  className="bookmark-title"
                  to={`/subject/${item.subject}/chapter/${item.chapter}/topic/${item.topic}`}
                >
                  {item.title || formatName(item.topic)}
                </Link>
              </div>

              <button
                className="bookmark-remove"
                onClick={() =>
                  handleRemove(item.subject, item.chapter, item.topic)
                }
                title="Remove bookmark"
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookmarksPage;
