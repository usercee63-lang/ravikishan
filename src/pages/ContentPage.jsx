import { useParams } from "react-router-dom";
import { useEffect } from "react";

import { useContent } from "../hooks/useContent";
import { useReadingHistory } from "../hooks/useReadingHistory";
import { useProgress } from "../hooks/useProgress";

import ProgressButton from "../components/contents/ProgressButton";
import ContentRenderer from "../components/contents/ContentRenderer";
import ContentExtras from "../components/contents/ContentExtras";
import AiTutorButton from "../components/AiTutorButton";
import CreditBanner from "../components/CreditBanner";

function ContentPage() {
  const { subjectId, chapterId, topicId } = useParams();

  const { content, loading, error } = useContent(
    subjectId,
    chapterId,
    topicId
  );

  const { status, updateStatus } = useProgress(
    subjectId,
    chapterId,
    topicId
  );

  useEffect(() => {
    if (content) {
      updateStatus("in-progress");
    }
  }, [content]);

  useReadingHistory(
    subjectId,
    chapterId,
    topicId,
    content?.title
  );

  if (loading) return <h2>Loading...</h2>;

  if (error) return <h2>{error}</h2>;

  if (!content) return <h2>No content found.</h2>;

  return (
    <div className="content-page zoom">
      <div className="content-card">
        <h2>{content.title}</h2>

       <ProgressButton
  status={status}
  updateStatus={updateStatus}
/>

    <CreditBanner />

    <ContentRenderer content={content} />

    <ContentExtras content={content} />

        <ContentRenderer content={content} />

        <ContentExtras content={content} />

        <AiTutorButton content={content} />
      </div>
    </div>
  );
}

export default ContentPage;
