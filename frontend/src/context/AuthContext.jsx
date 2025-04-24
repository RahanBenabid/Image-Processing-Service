import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          api.setAuthToken(token);
          setCurrentUser({
            id: decoded.id,
            email: decoded.email,
          });
        } catch (err) {
          console.error("Token decoding error:", err);
          localStorage.removeItem("token");
          api.clearAuthToken();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await authService.login(email, password);

      if (!token) {
        throw new Error("No token received");
      }

      localStorage.setItem("token", token);
      api.setAuthToken(token);

      const decoded = jwtDecode(token);
      const authenticatedUser = {
        id: decoded.id,
        email: decoded.email,
        ...user,
      };

      setCurrentUser(authenticatedUser);
      return authenticatedUser;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    console.log("helloooo", username, email, password);
    try {
      const response = await authService.register(username, email, password);
      setCurrentUser(response.user);
      localStorage.setItem("token", response.token);

      return response.user;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    api.clearAuthToken();
    setCurrentUser(null);
  };

  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await authService.updateUser(userId, userData);
      setCurrentUser((prev) => ({ ...prev, ...updatedUser }));
      return updatedUser;
    } catch (err) {
      setError(err.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    getToken: () => localStorage.getItem("token"),
    isAuthenticated: () => !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
