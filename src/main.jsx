import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/theme.css";

import "./index.css";
import "./styles/footer.css";

import "./styles/cards.css";
import "./styles/buttons.css";
import "./styles/subject.css";
import "./styles/chapter.css";
import "./styles/topic.css";
import "./styles/content.css";
import "./styles/animations.css";
import "./styles/responsive.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

import "./styles/header.css";
import "./styles/breadcrumb.css";
import "./styles/search.css";
import "./styles/ai.css";