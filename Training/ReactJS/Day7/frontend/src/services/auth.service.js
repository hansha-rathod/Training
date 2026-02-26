import { post, get } from "./http";

const API_BASE_URL = "http://localhost:3001";

/**
 * Authentication Service
 * Handles all authentication related API calls
 */
export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Login response with token and user data
   */
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  },

  /**
   * Get current authenticated user
   * @returns {Promise} - User data
   */
  getCurrentUser: async () => {
    return get("/me");
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise} - Created user data
   */
  register: async (userData) => {
    return post("/users/register", userData);
  },

  /**
   * Logout user (client-side only)
   */
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;
