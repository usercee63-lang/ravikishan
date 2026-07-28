import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const subjects = [
  { id: "physics", title: "Physics" },
  { id: "chemistry", title: "Chemistry" },
  { id: "biology", title: "Biology" },
  { id: "mathematics", title: "Mathematics" },
  { id: "english", title: "English" },
  { id: "nepali", title: "Nepali" }
];

function SearchBar() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState([]);

  useEffect(() => {
    async function buildIndex() {
      const results = [];

      for (const subject of subjects) {
        try {
          const res = await fetch(`/data/navigation/${subject.id}.json`);
          const data = await res.json();

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

    </div>
  );
}

export default SearchBar;
