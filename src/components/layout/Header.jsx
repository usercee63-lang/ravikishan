import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <header className="app-header">
      <div className="header-left">
        {!isHome && (
          <>
            <button
              className="nav-button"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>

            <button
              className="nav-button secondary"
              onClick={() => window.history.back()}
            >
              ⟵ Previous
            </button>
          </>
        )}
      </div>

      <div className="header-center">
        <Link
          to="/"
          className="home-button"
        >
          📚 Ravikishan's Home
        </Link>
      </div>

      <div className="header-right">
      </div>
    </header>
  );
}

export default Header;
