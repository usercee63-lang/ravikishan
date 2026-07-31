import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Breadcrumb from "./components/navigation/Breadcrumb";
import SearchBar from "./components/ui/SearchBar";

import Home from "./pages/Home";
import ChapterPage from "./pages/ChapterPage";
import TopicPage from "./pages/TopicPage";
import ContentPage from "./pages/ContentPage";
import BookmarksPage from "./pages/BookmarksPage";
import AuthPage from "./pages/AuthPage";
import Settings from "./pages/Settings";

function App() {
  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/settings";

  return (
    <>
      <Header />

      {!isAuthRoute && location.pathname !== "/" && <Breadcrumb />}

      {!isAuthRoute && <SearchBar />}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/bookmarks" element={<BookmarksPage />} />

        <Route path="/login" element={<AuthPage />} />

        <Route path="/settings" element={<Settings />} />

        <Route
          path="/subject/:subjectId"
          element={<ChapterPage />}
        />

        <Route
          path="/subject/:subjectId/chapter/:chapterId"
          element={<TopicPage />}
        />

        <Route
          path="/subject/:subjectId/chapter/:chapterId/topic/:topicId"
          element={<ContentPage />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
