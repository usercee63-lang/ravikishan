import {
  useEffect,
  useState,
  useCallback,
} from "react";

import * as authService from "../services/authService";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await authService.getMe();

        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = useCallback(async ({ email, password }) => {
    const data = await authService.login({ email, password });

    if (data.pending2fa) {
      return { pending2fa: true, tempToken: data.tempToken };
    }

    setUser(data.user);
    return { pending2fa: false, user: data.user };
  }, []);

  const handleTwoFactorLogin = useCallback(
    async ({ code, tempToken }) => {
      const data = await authService.loginWithTwoFactor({ code, tempToken });
      setUser(data.user);
      return data;
    },
    []
  );

  const handleRegister = useCallback(async ({ name, email, password }) => {
    const data = await authService.register({ name, email, password });
    setUser(data.user);
    return data;
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // still clear local state even if the server call fails
    }

    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login: handleLogin,
    loginWithTwoFactor: handleTwoFactorLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser: loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
