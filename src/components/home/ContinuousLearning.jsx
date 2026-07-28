import { Link } from "react-router-dom";
import { getLastTopic } from "../../utils/history";

function ContinueLearning() {
  const topic = getLastTopic();

  if (!topic) return null;

  return (
    <div className="dashboard-card">
      <h2>Continue Learning</h2>

      <Link
        to={`/subject/${topic.subject}/chapter/${topic.chapter}/topic/${topic.topic}`}
      >
        <strong>{topic.subject}</strong>

        <p>{topic.chapter}</p>

        <span>{topic.topic}</span>
      </Link>
    </div>
  );
}

export default ContinueLearning;
