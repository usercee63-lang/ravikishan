import { useState } from "react";

function Quiz({ questions }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const question = questions[current];

  function handleSelect(optionIndex) {
    if (selected !== null) return;

    setSelected(optionIndex);

    if (optionIndex === question.answer) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="card">
        <h3>Quiz Result</h3>

        <p>
          You scored {score} out of {questions.length}
        </p>

        <button onClick={restart}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>{question.question}</h3>

      <ul className="quiz-options">
        {question.options.map((option, index) => (
          <li key={index}>
            <button
              onClick={() => handleSelect(index)}
              disabled={selected !== null}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>

      {selected !== null && (
        <div className="quiz-feedback">
          <p>
            {selected === question.answer
              ? "✅ Correct!"
              : "❌ Incorrect"}
          </p>

          <button onClick={next}>
            {current + 1 >= questions.length
              ? "Finish"
              : "Next Question"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
