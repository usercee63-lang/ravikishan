import { Link } from "react-router-dom";

const subjects = [
  { id: "physics", name: "Physics", icon: "⚛️" },
  { id: "chemistry", name: "Chemistry", icon: "🧪" },
  { id: "biology", name: "Biology", icon: "🧬" },
  { id: "mathematics", name: "Mathematics", icon: "📐" },
  { id: "english", name: "English", icon: "📘" },
  { id: "nepali", name: "Nepali", icon: "🇳🇵" },
];

function SubjectPage() {
  return (
    <div className="subject-page fade">
      <h1 className="subject-title">Curated by Ravikishan</h1>

      <div className="subject-grid">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/subject/${subject.id}`}
            className="subject-card"
          >
            <div className="subject-icon">{subject.icon}</div>

            <div className="subject-name">
              {subject.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SubjectPage;
