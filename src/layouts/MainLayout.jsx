import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import SubjectPage from "../pages/SubjectPage";
import ChapterPage from "../pages/ChapterPage";
import TopicPage from "../pages/TopicPage";

export default function MainLayout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/subject/:subjectId"
          element={<SubjectPage />}
        />

        <Route
          path="/subject/:subjectId/chapter/:chapterId"
          element={<ChapterPage />}
        />

        <Route
          path="/subject/:subjectId/chapter/:chapterId/topic/:topicId"
          element={<TopicPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
