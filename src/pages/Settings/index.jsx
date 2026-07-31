import { useState } from "react";
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
            <strong>Two-factor authentication:</strong>{" "}
            {user?.twoFactorEnabled ? "✅ Enabled" : "❌ Disabled"}
          </p>
        </section>

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
