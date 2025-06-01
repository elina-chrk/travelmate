import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("✅ JWT payload on load:", payload);

        setUserId(payload.sub);
        setUsername(payload.username);

        setIsAdmin(payload.IsSystemAdmin === "True");

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Невірний токен:", error);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("✅ JWT payload on login:", payload);

    setUserId(payload.sub);
    setUsername(payload.username);
    setIsAdmin(payload.IsSystemAdmin === "True");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserId(null);
    setUsername("");
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userId,
        username,
        isAdmin,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
