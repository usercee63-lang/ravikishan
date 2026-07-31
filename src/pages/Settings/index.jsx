import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";

function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [adminRequests, setAdminRequests] = useState(null);
  const [adminError, setAdminError] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) return;

    let cancelled = false;

    (async () => {
      try {
        const data = await authService.adminListRequests();

        if (!cancelled) {
          setAdminRequests(data.requests);
        }
      } catch (err) {
        if (!cancelled) {
          setAdminError(err.message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.isAdmin]);

  async function reloadRequests() {
    const data = await authService.adminListRequests();
    setAdminRequests(data.requests);
  }

  async function handleAdminApprove(email) {
    try {
      await authService.adminApprove(email);
      await reloadRequests();
    } catch (err) {
      setAdminError(err.message);
    }
  }

  async function handleAdminReject(email) {
    try {
      await authService.adminReject(email);
      await reloadRequests();
    } catch (err) {
      setAdminError(err.message);
    }
  }

  async function handleEnableStart() {
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      const data = await authService.setupTwoFactor();
      setSetup(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEnableConfirm() {
    setError(null);
    setSubmitting(true);

    try {
      await authService.verifyTwoFactor({ code });
      setSetup(null);
      setCode("");
      setNotice("Two-factor authentication is now enabled");
      refreshUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDisable() {
    setError(null);
    setSubmitting(true);

    try {
      await authService.disableTwoFactor({ code });
      setCode("");
      setNotice("Two-factor authentication is now disabled");
      refreshUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <div className="content-page zoom">
      <div className="content-card settings-card">
        <h2>⚙️ Settings</h2>

        <section className="settings-section">
          <h3>Account</h3>

          <p className="settings-info">
            <strong>Name:</strong> {user?.name}
          </p>

          <p className="settings-info">
            <strong>Email:</strong> {user?.email}
          </p>

          <p className="settings-info">
            <strong>Role:</strong>{" "}
            {user?.isAdmin ? "👑 Admin" : "Member"}
          </p>

          <p className="settings-info">
            <strong>Two-factor authentication:</strong>{" "}
            {user?.twoFactorEnabled ? "✅ Enabled" : "❌ Disabled"}
          </p>
        </section>

        {user?.isAdmin && (
          <section className="settings-section">
            <h3>Access Requests</h3>

            <p className="settings-hint">
              Users below have requested access to the study content.
              Approved users can view content immediately.
            </p>

            {adminError && <p className="auth-error">{adminError}</p>}

            {adminRequests === null && !adminError && (
              <p className="settings-hint">Loading requests...</p>
            )}

            {adminRequests !== null && adminRequests.length === 0 && (
              <p className="settings-hint">No access requests yet.</p>
            )}

            {adminRequests?.map((request) => (
              <div key={request.email} className="admin-request-row">
                <div className="admin-request-info">
                  <strong>{request.name || "—"}</strong>{" "}
                  <span className="admin-request-email">{request.email}</span>

                  <span
                    className={`request-status status-${request.status}`}
                  >
                    {request.status}
                  </span>

                  <span className="admin-request-date">
                    {new Date(request.requestedAt).toLocaleString()}
                  </span>
                </div>

                {request.status === "pending" && (
                  <div className="admin-request-actions">
                    <button
                      className="auth-submit settings-button"
                      onClick={() => handleAdminApprove(request.email)}
                    >
                      ✓ Approve
                    </button>

                    <button
                      className="auth-submit settings-button danger"
                      onClick={() => handleAdminReject(request.email)}
                    >
                      ✕ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        <section className="settings-section">
          <h3>Two-Factor Authentication (2FA)</h3>

          {error && <p className="auth-error">{error}</p>}
          {notice && <p className="auth-notice">{notice}</p>}

          {!user?.twoFactorEnabled && !setup && (
            <button
              className="auth-submit settings-button"
              onClick={handleEnableStart}
              disabled={submitting}
            >
              Enable 2FA
            </button>
          )}

          {setup && (
            <div className="tfa-setup">
              <p className="settings-hint">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.), then enter the 6-digit code
                below to confirm.
              </p>

              <img
                className="tfa-qr"
                src={setup.qrCode}
                alt="2FA QR code"
              />

              <p className="settings-hint">
                Or enter this secret manually:{" "}
                <code className="tfa-secret">{setup.secret}</code>
              </p>

              <input
                className="auth-input"
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <button
                className="auth-submit settings-button"
                onClick={handleEnableConfirm}
                disabled={submitting || code.length < 6}
              >
                {submitting ? "Verifying..." : "Confirm & Enable"}
              </button>
            </div>
          )}

          {user?.twoFactorEnabled && (
            <div className="tfa-setup">
              <p className="settings-hint">
                Enter a code from your authenticator app to disable 2FA.
              </p>

              <input
                className="auth-input"
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />

              <button
                className="auth-submit settings-button danger"
                onClick={handleDisable}
                disabled={submitting || code.length < 6}
              >
                Disable 2FA
              </button>
            </div>
          )}
        </section>

        <section className="settings-section">
          <button
            className="auth-submit settings-button danger"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;
