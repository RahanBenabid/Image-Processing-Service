import api from "./api";

const authService = {
  register: async ({ fullName, email, password }) => {
    try {
      console.log("looooog: ", fullName, email, password);
      const response = await api.post("/api/users/register", {
        username: fullName,
        email,
        password,
      });
      console.log("hi", response);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.response?.data?.message || "Failed to register");
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("/api/users/login", { email, password });
      console.log("Auth service login response:", response);

      return {
        user: response.user,
        token: response.token,
      };
    } catch (error) {
      console.log("sexy log", email, password);
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  },

  verifyToken: async (token) => {
    try {
      api.setAuthToken(token);
      return await api.get("/api/users/verify");
    } catch (error) {
      console.error("Token verification error:", error.message);
      throw new Error("Session expired");
    }
  },

  updateUser: async (userId, userData) => {
    try {
      return await api.put(`/api/users/${userId}`, userData);
    } catch (error) {
      console.error("User update error:", error);
      throw new Error(error.response?.data?.message || "Update failed");
    }
  },

  deleteUser: async (userId) => {
    try {
      return await api.delete(`/api/users/${userId}`);
    } catch (error) {
      console.error("User deletion error:", error);
      throw new Error(error.response?.data?.message || "Deletion failed");
    }
  },
};

export default authService;
