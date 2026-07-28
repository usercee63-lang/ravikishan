import { Routes, Route, useLocation } from "react-router-dom";



import Header from "./components/layout/Header";
import Footer from "./components/Footer";
import Breadcrumb from "./components/navigation/Breadcrumb";
import SearchBar from "./components/ui/SearchBar";

import Home from "./pages/Home";
import ChapterPage from "./pages/ChapterPage";
import TopicPage from "./pages/TopicPage";
import ContentPage from "./pages/ContentPage";

function App() {
  const location = useLocation();

  return (
    <>
      <Header />

      {location.pathname !== "/" && <Breadcrumb />}

      <SearchBar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

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
    </>
  );
}

export default App;


<>
  {/* Existing components */}

  <Footer />
</>
