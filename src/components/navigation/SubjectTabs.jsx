import { useState } from "react";
import { useNavigation } from "../../hooks/useNavigation";

const subjects = [
  "physics",
  "chemistry",
  "biology",
  "math",
  "english",
  "nepali",
];

export default function SubjectTabs({ onSelect }) {
  const [selectedSubject, setSelectedSubject] = useState(null);

  const { loading, error } = useNavigation(selectedSubject);

  function handleSelect(subject) {
    setSelectedSubject(subject);

    if (onSelect) {
      onSelect(subject);
    }
  }

  return (
    <div>
      <h2>Subjects</h2>

      {subjects.map((subject) => (
        <button
          key={subject}
          onClick={() => handleSelect(subject)}
        >
          {subject}
        </button>
      ))}

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}
    </div>
  );
}
