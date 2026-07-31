// src/components/ContentViewer.jsx
import { useState } from "react";
import NotesRenderer from "../renderers/NotesRenderer";
import KeyPointsRenderer from "../renderers/KeyPointsRenderer";
import ExamplesRenderer from "../renderers/ExamplesRenderer";
import FormulaRenderer from "../renderers/FormulaRenderer";
import DiagramRenderer from "../renderers/DiagramRenderer";
import PracticeRenderer from "../renderers/PracticeRenderer";
import SummaryRenderer from "../renderers/SummaryRenderer";

import AiTutorModal from "./AiTutorModal";
import {
  isTopicBookmarked,
  toggleBookmarkStorage,
  getStoredUserNote,
  saveStoredUserNote,
  markTopicCompleted,
  getStoredProgress,
} from "../utils/offlineStorage";

export default function ContentViewer({ subject, chapter, topic, content }) {
  const [isBookmarked, setIsBookmarked] = useState(() =>
    isTopicBookmarked(subject, chapter, topic)
  );
  const [isCompleted, setIsCompleted] = useState(() =>
    Boolean(getStoredProgress()[`${subject}-${chapter}-${topic}`]?.completed)
  );
  const [userNote, setUserNote] = useState(() =>
    getStoredUserNote(subject, chapter, topic)
  );
  const [noteSavedMessage, setNoteSavedMessage] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  const [prevKey, setPrevKey] = useState(null);
  const currentKey = subject && chapter && topic
    ? `${subject}/${chapter}/${topic}`
    : null;

  if (prevKey !== currentKey) {
    setPrevKey(currentKey);

    if (currentKey) {
      setIsBookmarked(isTopicBookmarked(subject, chapter, topic));
      setIsCompleted(Boolean(getStoredProgress()[`${subject}-${chapter}-${topic}`]?.completed));
      setUserNote(getStoredUserNote(subject, chapter, topic));
      setActiveTab("content");
    }
  }

  if (!content) {
    return <p className="p-8 text-center text-slate-400">Select a topic to view content.</p>;
  }

  const handleBookmarkToggle = () => {
    const newState = toggleBookmarkStorage({
      key: `${subject}-${chapter}-${topic}`,
      subject,
      chapter,
      topic,
      title: content.title || topic,
    });
    setIsBookmarked(newState);
  };

  const handleCompletedToggle = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    markTopicCompleted(subject, chapter, topic, nextState);
  };

  const handleSaveNote = () => {
    saveStoredUserNote(subject, chapter, topic, userNote);
    setNoteSavedMessage(true);
    setTimeout(() => setNoteSavedMessage(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 space-y-6">
      {/* Control Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {subject} • {chapter}
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
            {content.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Mark Completed */}
          <button
            onClick={handleCompletedToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isCompleted
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            {isCompleted ? "✓ Completed" : "Mark Complete"}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
              isBookmarked
                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
            title="Bookmark topic"
          >
            ★
          </button>

          {/* Ask AI Tutor */}
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            ✨ Ask AI Tutor
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === "content" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          Study Material
        </button>
        <button
          onClick={() => setActiveTab("personal_notes")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === "personal_notes" ? "bg-indigo-600 text-white" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          My Personal Notes
        </button>
      </div>

      {/* Tab 1: Standard Topic Content */}
      {activeTab === "content" && (
        <div className="space-y-4">
          <NotesRenderer notes={content.notes} />
          <KeyPointsRenderer keyPoints={content.keyPoints} />
          <ExamplesRenderer examples={content.examples} />
          <FormulaRenderer formulas={content.formulas} />
          <DiagramRenderer diagrams={content.diagrams} />
          <PracticeRenderer practice={content.practice} />
          <SummaryRenderer summary={content.summary} />
        </div>
      )}

      {/* Tab 2: Personal Scratchpad */}
      {activeTab === "personal_notes" && (
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Synthesis & Exam Notes</h3>
            {noteSavedMessage && <span className="text-xs text-emerald-500 font-bold">Saved!</span>}
          </div>
          <textarea
            rows={8}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="Write down your key insights, memory mnemonics, or formulas..."
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
          />
          <button
            onClick={handleSaveNote}
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Save Note
          </button>
        </div>
      )}

      {/* AI Tutor Modal */}
      <AiTutorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        topicTitle={content.title}
        notesContent={content.notes}
      />
    </div>
  );
}
