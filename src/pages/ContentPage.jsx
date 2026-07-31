import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useContent } from "../hooks/useContent";
import { useReadingHistory } from "../hooks/useReadingHistory";
import { useProgress } from "../hooks/useProgress";

import ComingSoon from "../components/contents/ComingSoon";
import AccessGate from "../components/contents/AccessGate";
import ReadingProgress from "../components/contents/ReadingProgress";
import ReadingTime from "../components/contents/ReadingTime";
import ProgressButton from "../components/contents/ProgressButton";
import ContentRenderer from "../renderers/ContentRenderer";
import ContentExtras from "../components/contents/ContentExtras";
import ContentTabs from "../components/contents/ContentTabs";
import Numerical from "../components/contents/Numerical";
import Video from "../components/contents/Video";
import MindMap from "../components/contents/MindMap";
import FlashcardDeck from "../components/flashcards/FlashcardDeck";
import Quiz from "../components/quiz/Quiz";
import BookmarkButton from "../components/contents/BookmarkButton";
import CreditBanner from "../components/CreditBanner";
import AiTutorButton from "../components/AiTutorButton";

function ContentPage() {
  const { subjectId, chapterId, topicId } = useParams();

  const [activeTab, setActiveTab] = useState("notes");

  const tabs = [
    { id: "notes", title: "📝 Notes" },
    { id: "numerical", title: "🧮 Numerical" },
    { id: "flashcards", title: "🃏 Flashcards" },
    { id: "quiz", title: "❓ Quiz" },
    { id: "video", title: "🎥 Video" },
    { id: "mindmap", title: "🧠 Mind Map" },
  ];

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
  }, [content, updateStatus]);

  useReadingHistory(
    subjectId,
    chapterId,
    topicId,
    content?.title
  );

  if (loading) return <h2>Loading...</h2>;

  if (error?.status === 401) {
    return <Navigate to="/login" replace />;
  }

  if (error?.status === 403) {
    return <AccessGate />;
  }

  if (error) {
    return (
      <div className="content-page zoom">
        <div className="content-card">
          <h2>🚧 This section is coming soon 🚀</h2>

          <p
            style={{
              marginTop: 20,
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Content for this topic has not been added yet.
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-page zoom">
        <div className="content-card">
          <h2>🚧 This section is coming soon 🚀</h2>

          <p
            style={{
              marginTop: 20,
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Content for this topic has not been added yet.
          </p>
        </div>
      </div>
    );
  }

  if (content?.comingSoon) {
    return <ComingSoon />;
  }

  return (
    <>
      <ReadingProgress />

      <div className="content-page zoom">
        <div className="content-card">

          <h2>{content.title}</h2>

          <ReadingTime
            text={JSON.stringify(content.notes || [])}
          />

          <ProgressButton
            status={status}
            updateStatus={updateStatus}
          />

          <BookmarkButton
            subject={subjectId}
            chapter={chapterId}
            topic={topicId}
            title={content.title}
          />

          <CreditBanner />

          <ContentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
          />

          {activeTab === "notes" && (
            <div className="tab-pane tab-pane-notes">
              <ContentRenderer content={content} />
              <ContentExtras content={content} />
            </div>
          )}

          {activeTab === "numerical" && (
            <div className="tab-pane">
              <Numerical numericals={content.numericals} />
            </div>
          )}

          {activeTab === "flashcards" &&
            (content.flashcards?.length ? (
              <div className="tab-pane tab-pane-flashcards">
                <FlashcardDeck cards={content.flashcards} />
              </div>
            ) : (
              <ComingSoon />
            ))}

          {activeTab === "quiz" &&
            (content.quiz?.length ? (
              <div className="tab-pane tab-pane-quiz">
                <Quiz questions={content.quiz} />
              </div>
            ) : (
              <ComingSoon />
            ))}

          {activeTab === "video" &&
            (content.videos?.length || content.video?.length ? (
              <div className="tab-pane tab-pane-video">
                <Video videos={content.videos?.length ? content.videos : content.video} />
              </div>
            ) : (
              <ComingSoon />
            ))}

          {activeTab === "mindmap" &&
            (content.mindmap ? (
              <div className="tab-pane tab-pane-mindmap">
                <MindMap mindmap={content.mindmap} />
              </div>
            ) : (
              <ComingSoon />
            ))}

          <AiTutorButton content={content} />

        </div>
      </div>
    </>
  );
}

export default ContentPage;