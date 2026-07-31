import { Link, useParams, Navigate } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";
import AccessGate from "../components/contents/AccessGate";

function ChapterPage() {
  const { subjectId } = useParams();

  const { data, loading, error } = useNavigation(subjectId);

  if (loading) return <h2>Loading...</h2>;

  if (error?.status === 401) {
    return <Navigate to="/login" replace />;
  }

  if (error?.status === 403) {
    return <AccessGate />;
  }

  if (error) return <h2>{error.message}</h2>;

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
