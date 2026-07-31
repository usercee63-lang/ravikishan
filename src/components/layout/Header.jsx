import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isHome = location.pathname === "/";

  async function handleLogout() {
    await logout();
    navigate("/");
  }

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
        <Link to="/bookmarks" className="nav-button bookmarks-link">
          🔖 Bookmarks
        </Link>

        {user ? (
          <>
            <Link to="/settings" className="nav-button user-button">
              👤 {(user.name || user.email || "User").split(" ")[0]}
            </Link>

            <button
              className="nav-button secondary logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-button login-button">
            🔐 Login
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
