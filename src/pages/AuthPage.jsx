import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import * as authService from "../services/authService";

const MODES = ["login", "register", "forgot", "reset"];

function AuthPage() {
  const { login, loginWithTwoFactor, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    code: "",
    resetToken: "",
  });
  const [pending2fa, setPending2fa] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError(null);
    setNotice(null);
    setPending2fa(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        const result = await login(form);

        if (result.pending2fa) {
          setPending2fa(result);
        } else {
          navigate("/");
        }
      } else if (mode === "register") {
        await register(form);
        navigate("/");
      } else if (mode === "forgot") {
        const data = await authService.forgotPassword({ email: form.email });
        setNotice(
          `Reset token: ${data.resetToken} — copy it and use the "Reset Password" tab to set a new password.`
        );
      } else if (mode === "reset") {
        await authService.resetPassword({
          token: form.resetToken,
          newPassword: form.password,
        });
        setNotice("Password reset successfully. You can now log in.");
        switchMode("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTwoFactorCode(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await loginWithTwoFactor({
        code: form.code,
        tempToken: pending2fa.tempToken,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (pending2fa) {
    return (
      <div className="auth-page fade">
        <div className="auth-card">
          <h1 className="auth-title">🔐 Two-Factor Authentication</h1>

          <p className="auth-subtitle">
            Enter the 6-digit code from your authenticator app
          </p>

          <form onSubmit={handleTwoFactorCode}>
            <label className="auth-label">Verification Code</label>

            <input
              className="auth-input"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              value={form.code}
              onChange={(e) => update("code", e.target.value)}
              required
              autoFocus
            />

            {error && <p className="auth-error">{error}</p>}

            <button
              className="auth-submit"
              type="submit"
              disabled={submitting || form.code.length < 6}
            >
              {submitting ? "Verifying..." : "Verify & Log In"}
            </button>

            <button
              className="auth-link-button"
              type="button"
              onClick={() => {
                setPending2fa(null);
                setError(null);
              }}
            >
              ← Back to login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page fade">
      <div className="auth-card">
        <h1 className="auth-title">📚 Ravikishan</h1>

        <div className="auth-tabs">
          {MODES.map((m) => (
            <button
              key={m}
              className={`auth-tab ${mode === m ? "active" : ""}`}
              onClick={() => switchMode(m)}
            >
              {m === "login" && "Log In"}
              {m === "register" && "Register"}
              {m === "forgot" && "Forgot Password"}
              {m === "reset" && "Reset Password"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label className="auth-label">Full Name</label>

              <input
                className="auth-input"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
                minLength={2}
              />
            </>
          )}

          <label className="auth-label">Email</label>

          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            autoComplete="email"
          />

          {(mode === "login" || mode === "register" || mode === "reset") && (
            <>
              <label className="auth-label">
                {mode === "reset" ? "New Password" : "Password"}
              </label>

              <input
                className="auth-input"
                type="password"
                placeholder={
                  mode === "reset"
                    ? "New password (min 8 characters)"
                    : "Password"
                }
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
                minLength={8}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </>
          )}

          {mode === "reset" && (
            <>
              <label className="auth-label">Reset Token</label>

              <input
                className="auth-input"
                type="text"
                placeholder="Paste the reset token here"
                value={form.resetToken}
                onChange={(e) => update("resetToken", e.target.value)}
                required
              />
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          {notice && <p className="auth-notice">{notice}</p>}

          <button
            className="auth-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : mode === "register"
                  ? "Create Account"
                  : mode === "forgot"
                    ? "Send Reset Token"
                    : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
