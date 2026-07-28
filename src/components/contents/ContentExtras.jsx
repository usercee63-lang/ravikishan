import FlashcardDeck from "../flashcards/FlashcardDeck";
import Quiz from "../quiz/Quiz";

export default function ContentExtras({ content }) {
  return (
    <>
      {/* Flashcards */}
      {content.flashcards?.length > 0 && (
        <>
          <h2>Flashcards</h2>
          <FlashcardDeck cards={content.flashcards} />
        </>
      )}

      {/* Quiz */}
      {content.quiz?.length > 0 && (
        <>
          <h2>Quiz</h2>
          <Quiz questions={content.quiz} />
        </>
      )}

      {/* Related Topics */}
      {content.relatedTopics?.length > 0 && (
        <div className="content-section">
          <h2>Related Topics</h2>

          <ul>
            {content.relatedTopics.map((topic) => (
              <li key={topic.id}>{topic.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* References */}
      {content.references?.length > 0 && (
        <div className="content-section">
          <h2>References</h2>

          <ul>
            {content.references.map((ref, index) => (
              <li key={index}>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reading Time */}
      {content.readingTime && (
        <p>
          <strong>Reading Time:</strong> {content.readingTime}
        </p>
      )}

      {/* Difficulty */}
      {content.level && (
        <p>
          <strong>Difficulty:</strong> {content.level}
        </p>
      )}

      {/* Last Updated */}
      {content.updatedAt && (
        <p>
          <strong>Updated:</strong> {content.updatedAt}
        </p>
      )}

      {/* Download PDF */}
      {content.pdf && (
        <a
          href={content.pdf}
          target="_blank"
          rel="noreferrer"
        >
          Download PDF
        </a>
      )}
    </>
  );
}
