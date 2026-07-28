import { Link } from "react-router-dom";

const subjects = [
  { id: "physics", name: "Physics", icon: "⚛️", color: "#3b82f6" },
  { id: "chemistry", name: "Chemistry", icon: "🧪", color: "#10b981" },
  { id: "biology", name: "Biology", icon: "🧬", color: "#22c55e" },
  { id: "mathematics", name: "Mathematics", icon: "📐", color: "#f59e0b" },
  { id: "english", name: "English", icon: "📘", color: "#8b5cf6" },
  { id: "nepali", name: "Nepali", icon: "🇳🇵", color: "#ef4444" },
];

function Home() {
  return (
    <div className="page-container fade">
      <div className="hero-section">
        <h1 className="premium-title">
          🌱 Improvement is Life
        </h1>

        <p className="hero-subtitle">
          Your Personal Study Vault
        </p>
      </div>

     

      <div className="section">
        <h2 className="section-title">
          Contents 📖 
        </h2>
         <CreditBanner />
        <div className="subject-grid">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              to={`/subject/${subject.id}`}
              className="subject-card"
              style={{
                borderTop: `5px solid ${subject.color}`,
              }}
            >
              <div
                className="subject-icon"
                style={{ color: subject.color }}
              >
                {subject.icon}
              </div>

              <div className="subject-name">
                {subject.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
