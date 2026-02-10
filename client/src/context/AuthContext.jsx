import { createContext, useEffect, useState } from "react";
import API from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Auto-check logged-in user on app load / refresh
   * IMPORTANT:
   * - 401 here is NORMAL when user is not logged in
   * - Never show toast or error popup here
   */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        // ❌ Do NOT show toast here
        // ❌ 401 is expected for logged-out users
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  /**
   * Logout (cookie-based)
   */
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed");
    } finally {
      setUser(null); // clear frontend state
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
