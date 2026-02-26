// HTTP module for making API requests
const API_BASE_URL = "http://localhost:3001";

/**
 * Generic fetch wrapper with token handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Something went wrong");
  }

  return response.json();
};

/**
 * HTTP GET request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
export const get = async (endpoint) => {
  return apiRequest(endpoint);
};

/**
 * HTTP POST request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data
 * @returns {Promise} - Response data
 */
export const post = async (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * HTTP PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data
 * @returns {Promise} - Response data
 */
export const put = async (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * HTTP PATCH request
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body data
 * @returns {Promise} - Response data
 */
export const patch = async (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

/**
 * HTTP DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
export const del = async (endpoint) => {
  return apiRequest(endpoint, {
    method: "DELETE",
  });
};

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  apiRequest,
};
