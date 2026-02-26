import { get, post, put, del } from "./http";

/**
 * Role Service
 * Handles all role related API calls
 */
export const roleService = {
  /**
   * Get all roles
   * @returns {Promise} - List of roles
   */
  getAll: async () => {
    return get("/roles");
  },

  /**
   * Get role by ID
   * @param {number} id - Role ID
   * @returns {Promise} - Role data
   */
  getById: async (id) => {
    return get(`/roles/${id}`);
  },

  /**
   * Create new role
   * @param {object} roleData - Role data
   * @returns {Promise} - Created role data
   */
  create: async (roleData) => {
    return post("/roles", roleData);
  },

  /**
   * Update role
   * @param {number} id - Role ID
   * @param {object} roleData - Updated role data
   * @returns {Promise} - Updated role data
   */
  update: async (id, roleData) => {
    return put(`/roles/${id}`, roleData);
  },

  /**
   * Delete role
   * @param {number} id - Role ID
   * @returns {Promise} - Response
   */
  delete: async (id) => {
    return del(`/roles/${id}`);
  },
};

export default roleService;
