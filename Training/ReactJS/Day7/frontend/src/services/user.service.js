import { get, post, put, del } from "./http";

/**
 * User Service
 * Handles all user related API calls
 */
export const userService = {
  /**
   * Get all users with role details
   * @returns {Promise} - List of users with roles
   */
  getAll: async () => {
    return get("/users-with-roles");
  },

  /**
   * Get user by ID
   * @param {number|string} id - User ID
   * @returns {Promise} - User data
   */
  getById: async (id) => {
    return get(`/users/${id}`);
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise} - Created user data
   */
  create: async (userData) => {
    return post("/users/register", userData);
  },

  /**
   * Update user
   * @param {number|string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise} - Updated user data
   */
  update: async (id, userData) => {
    return put(`/users/${id}`, userData);
  },

  /**
   * Delete user
   * @param {number|string} id - User ID
   * @returns {Promise} - Response
   */
  delete: async (id) => {
    return del(`/users/${id}`);
  },
};

export default userService;
