import { Link, useParams } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";

function ChapterPage() {
  const { subjectId } = useParams();

  const { data, loading, error } = useNavigation(subjectId);

  if (loading) return <h2>Loading...</h2>;

  if (error) return <h2>{error}</h2>;

  if (!data) return <h2>No chapters found.</h2>;

  return (
    <div className="chapter-page slide">
      <h1>{subjectId.toUpperCase()}</h1>

      <div className="chapter-grid">
        {data.chapters.map((chapter) => (
          <Link
            key={chapter.title}
            to={`/subject/${subjectId}/chapter/${chapter.id}`}
            className="chapter-card"
          >
            <h2 className="chapter-title">
              {chapter.title}
            </h2>

            <p>{chapter.topics.length} Topics</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ChapterPage;
