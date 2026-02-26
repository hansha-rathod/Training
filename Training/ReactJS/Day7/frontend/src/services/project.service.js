import { get, post, put, del } from "./http";

/**
 * Project Service
 * Handles all project related API calls
 */
export const projectService = {
  /**
   * Get all projects
   * @returns {Promise} - List of projects
   */
  getAll: async () => {
    return get("/projects");
  },

  /**
   * Get project by ID
   * @param {number|string} id - Project ID
   * @returns {Promise} - Project data
   */
  getById: async (id) => {
    return get(`/projects/${id}`);
  },

  /**
   * Create new project
   * @param {object} projectData - Project data
   * @returns {Promise} - Created project data
   */
  create: async (projectData) => {
    return post("/projects", projectData);
  },

  /**
   * Update project
   * @param {number|string} id - Project ID
   * @param {object} projectData - Updated project data
   * @returns {Promise} - Updated project data
   */
  update: async (id, projectData) => {
    return put(`/projects/${id}`, projectData);
  },

  /**
   * Delete project
   * @param {number|string} id - Project ID
   * @returns {Promise} - Response
   */
  delete: async (id) => {
    return del(`/projects/${id}`);
  },
};

export default projectService;
