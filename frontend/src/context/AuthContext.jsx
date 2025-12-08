import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading,setLoading]=useState(true)

  // Load user from localStorage (only in browser)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) setUser(savedUser);
      setLoading(false)
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
