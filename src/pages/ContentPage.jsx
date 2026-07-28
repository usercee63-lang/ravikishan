import { useParams } from "react-router-dom";
import { useContent } from "../hooks/useContent";
import { useReadingHistory } from "../hooks/useReadingHistory";
import { useProgress } from "../hooks/useProgress";
import ProgressButton from "../components/contents/ProgressButton";
import NotesRenderer from "../renderers/NotesRenderer";
import { useEffect } from "react";


function ContentPage() {
  const { subjectId, chapterId, topicId } = useParams();

  const {
    content,
    loading,
    error,
  } = useContent(subjectId, chapterId, topicId);

  // ✅ This was missing
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

        <NotesRenderer notes={content.notes} />
      </div>
    </div>
  );
}

export default ContentPage;