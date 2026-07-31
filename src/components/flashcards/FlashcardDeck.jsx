import { useState } from "react";

function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const card = cards[index];

  function goTo(nextIndex) {
    setFlipped(false);
    setIndex((nextIndex + cards.length) % cards.length);
  }

  return (
    <div className="card flashcard-deck">
      <div
        className="flashcard"
        onClick={() => setFlipped(!flipped)}
      >
        {flipped ? card.back : card.front}
      </div>

      <div className="flashcard-controls">
        <button onClick={() => goTo(index - 1)}>‹ Prev</button>

        <span>
          {index + 1} / {cards.length}
        </span>

        <button onClick={() => goTo(index + 1)}>Next ›</button>
      </div>
    </div>
  );
}

export default FlashcardDeck;
