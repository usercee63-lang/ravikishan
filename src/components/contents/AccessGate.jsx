import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";

function AccessGate({ children }) {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await authService.getAccessStatus();

        if (!cancelled) {
          setStatus(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!user) {
    return (
      <div className="content-page zoom">
        <div className="content-card">
          <h2>🔐 Login Required</h2>

          <p style={{ color: "#64748b" }}>
            Please log in to view this content. Only approved accounts can
            access the study material.
          </p>

          <Link className="btn" to="/login">
            Log In / Register
          </Link>
        </div>
      </div>
    );
  }

  if (status?.approved) {
    return children;
  }

  async function handleRequest() {
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const data = await authService.requestAccess();
      setMessage(data.message);
      setStatus((prev) => ({ ...prev, requestPending: true }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="content-page zoom">
      <div className="content-card">
        <h2>🔒 Access Required</h2>

        <p style={{ color: "#64748b" }}>
          Your account <strong>{user.email}</strong> is not yet approved to
          view content. Ask the site administrator to approve your email, or
          submit a request below.
        </p>

        {error && (
          <p className="auth-error" style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}

        {message && <p className="auth-notice">{message}</p>}

        {status?.requestPending ? (
          <p style={{ color: "#64748b" }}>
            ⏳ Your access request is <strong>pending approval</strong>. You
            will be able to view content once the administrator approves your
            email.
          </p>
        ) : (
          <button
            className="auth-submit settings-button"
            onClick={handleRequest}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Request Access"}
          </button>
        )}
      </div>
    </div>
  );
}

export default AccessGate;
