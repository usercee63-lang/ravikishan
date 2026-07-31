import { Link, useParams, Navigate } from "react-router-dom";
import { useNavigation } from "../hooks/useNavigation";
import AccessGate from "../components/contents/AccessGate";

function TopicPage() {
  const { subjectId, chapterId } = useParams();

  const { data, loading, error } = useNavigation(subjectId);

  if (loading) return <h2>Loading...</h2>;

  if (error?.status === 401) {
    return <Navigate to="/login" replace />;
  }

  if (error?.status === 403) {
    return <AccessGate />;
  }

  if (error) return <h2>{error.message}</h2>;

  if (!data) return <h2>No data found.</h2>;

  const chapter = data.chapters.find(
    (c) => c.id === chapterId
  );

  if (!chapter) return <h2>Chapter not found.</h2>;

  // ⭐ Important topics first
  const sortedTopics = [...chapter.topics].sort((a, b) => {
    if (a.important === b.important) return 0;
    return a.important ? -1 : 1;
  });

  return (
    <div className="topic-page fade">
      <h1>{chapter.title}</h1>

      <div className="topic-list">
        {sortedTopics.map((topic) => (
          <Link
            key={topic.id}
            to={`/subject/${subjectId}/chapter/${chapterId}/topic/${topic.id}`}
            className="topic-item"
          >
            <div className="topic-title">
              {topic.title}

              {topic.important && (
                <span className="important-badge">
                  📌
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TopicPage;