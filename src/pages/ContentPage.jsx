import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useContent } from "../hooks/useContent";
import { useReadingHistory } from "../hooks/useReadingHistory";
import { useProgress } from "../hooks/useProgress";

import ComingSoon from "../components/contents/ComingSoon";
import ReadingProgress from "../components/contents/ReadingProgress";
import ReadingTime from "../components/contents/ReadingTime";
import ProgressButton from "../components/contents/ProgressButton";
import ContentRenderer from "../renderers/ContentRenderer";
import ContentExtras from "../components/contents/ContentExtras";
import ContentTabs from "../components/contents/ContentTabs";
import Numerical from "../components/contents/Numerical";
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

          <CreditBanner />

          <ContentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
          />

          {activeTab === "notes" && (
            <>
              <ContentRenderer content={content} />
              <ContentExtras content={content} />
            </>
          )}

          {activeTab === "numerical" && (
            <Numerical numericals={content.numericals} />
          )}

          {["flashcards", "quiz", "video", "mindmap"].includes(activeTab) && (
            <div
              style={{
                marginTop: 30,
                padding: 40,
                textAlign: "center",
                borderRadius: 16,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h2 style={{ marginBottom: 15 }}>
                {tabs.find(tab => tab.id === activeTab)?.title}
              </h2>

              <p
                style={{
                  fontSize: 18,
                  color: "#475569",
                  marginBottom: 10,
                }}
              >
                🚧 This section is coming soon 🚀
              </p>

              <p
                style={{
                  color: "#64748b",
                }}
              >
                This feature is under development and will be available in a future update.
              </p>
            </div>
          )}

          <AiTutorButton content={content} />

        </div>
      </div>
    </>
  );
}

export default ContentPage;