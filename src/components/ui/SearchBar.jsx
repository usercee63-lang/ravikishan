import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { API_BASE } from "../../constants/api";

const subjects = [
  { id: "physics", title: "Physics" },
  { id: "chemistry", title: "Chemistry" },
  { id: "biology", title: "Biology" },
  { id: "mathematics", title: "Mathematics" },
  { id: "english", title: "English" },
  { id: "nepali", title: "Nepali" }
];

const FALLBACK_BASE = "http://localhost:5000";

async function fetchNavigation(subjectId) {
  const urls = [
    `${API_BASE}/api/navigation/${subjectId}`,
    `${FALLBACK_BASE}/api/navigation/${subjectId}`,
    `/data/navigation/${subjectId}.json`,
  ];

  let lastError;

  for (const url of urls) {
    try {
      const res = await fetch(url);

      if (res.status === 401 || res.status === 403) {
        const err = new Error(`Access required (${res.status})`);
        err.status = res.status;
        throw err;
      }

      if (!res.ok) {
        throw new Error(`${url} responded ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      lastError = err;

      if (err.status) {
        throw err;
      }
    }
  }

  throw lastError;
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState([]);
  const [gated, setGated] = useState(null);

  useEffect(() => {
    async function buildIndex() {
      const results = [];

      for (const subject of subjects) {
        try {
          const data = await fetchNavigation(subject.id);

          results.push({
            type: "subject",
            title: data.name,
            url: `/subject/${subject.id}`
          });

          data.chapters.forEach((chapter) => {
            results.push({
              type: "chapter",
              title: chapter.title,
              url: `/subject/${subject.id}/chapter/${chapter.id}`
            });

            chapter.topics.forEach((topic) => {
              results.push({
                type: "topic",
                title: topic.title,
                url: `/subject/${subject.id}/chapter/${chapter.id}/topic/${topic.id}`
              });
            });
          });

        } catch (err) {
          if (err.status === 401 || err.status === 403) {
            setGated(err.status);
            return;
          }

          console.error(subject.id, err);
        }
      }

      setIndex(results);
    }

    buildIndex();
  }, []);

  const filtered = useMemo(() => {

    if (!query) return [];

    return index
      .filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);

  }, [query, index]);

  return (
    <div className="search-container">

      {gated ? (
        <p className="search-gate">
          <Link to="/login">
            🔐 Log in to search subjects, chapters and topics
          </Link>
        </p>
      ) : (
        <>
          <input
            className="global-search"
            placeholder="🔍 Search subjects, chapters or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {filtered.length > 0 && (

            <div className="search-results">

              {filtered.map((item, i) => (

                <Link
                  key={i}
                  to={item.url}
                  className="search-item"
                  onClick={() => setQuery("")}
                >
                  <strong>{item.title}</strong>

                  <span>{item.type}</span>

                </Link>

              ))}

            </div>

          )}
        </>
      )}

    </div>
  );
}

export default SearchBar;
