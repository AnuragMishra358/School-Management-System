import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    const mode = localStorage.getItem("mode");
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (mode) setDark(JSON.parse(mode));
    if (token) setAuthenticated(true);
    if (userStr) setUser(JSON.parse(userStr));
  }, []);

  // Keep <html> updated with dark class
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const login = (credentials) => {
    setAuthenticated(true);
    setUser(credentials);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthenticated(false);
    setUser(null);
  };

  const modeChange = () => {
    localStorage.setItem("mode", `${!dark}`);
    setDark(!dark);
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        dark,
        login,
        logout,
        modeChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
