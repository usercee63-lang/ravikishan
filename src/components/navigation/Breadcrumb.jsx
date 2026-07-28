import { Link, useLocation, useParams } from "react-router-dom";
import { useNavigation } from "../../hooks/useNavigation";

function Breadcrumb() {
  const location = useLocation();
  const { subjectId, chapterId, topicId } = useParams();

  const { data } = useNavigation(subjectId);

  const chapter = data?.chapters?.find(
    (c) => c.id === chapterId
  );

  const topic = chapter?.topics?.find(
    (t) => t.id === topicId
  );

  return (
    <div className="breadcrumb">

      <Link to="/">🏠 Ravikishan's Home</Link>

      {subjectId && (
        <>
          <span> › </span>

          <Link to={`/subject/${subjectId}`}>
            {data?.name || subjectId}
          </Link>
        </>
      )}

      {chapter && (
        <>
          <span> › </span>

          <Link
            to={`/subject/${subjectId}/chapter/${chapter.id}`}
          >
            {chapter.title}
          </Link>
        </>
      )}

      {topic && (
        <>
          <span> › </span>

          <span className="current">
            {topic.title}
          </span>
        </>
      )}

    </div>
  );
}

export default Breadcrumb;
