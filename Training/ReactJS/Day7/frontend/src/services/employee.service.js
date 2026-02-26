import { get, post, put, del } from "./http";

/**
 * Employee Service
 * Handles all employee related API calls
 */
export const employeeService = {
  /**
   * Get all employees
   * @returns {Promise} - List of employees
   */
  getAll: async () => {
    return get("/employees");
  },

  /**
   * Get employee by ID
   * @param {number|string} id - Employee ID
   * @returns {Promise} - Employee data
   */
  getById: async (id) => {
    return get(`/employees/${id}`);
  },

  /**
   * Create new employee
   * @param {object} employeeData - Employee data
   * @returns {Promise} - Created employee data
   */
  create: async (employeeData) => {
    return post("/employees", employeeData);
  },

  /**
   * Update employee
   * @param {number|string} id - Employee ID
   * @param {object} employeeData - Updated employee data
   * @returns {Promise} - Updated employee data
   */
  update: async (id, employeeData) => {
    return put(`/employees/${id}`, employeeData);
  },

  /**
   * Delete employee
   * @param {number|string} id - Employee ID
   * @returns {Promise} - Response
   */
  delete: async (id) => {
    return del(`/employees/${id}`);
  },
};

export default employeeService;
