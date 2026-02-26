/**
 * API Module - Re-exports from individual service modules
 * This file maintains backward compatibility with existing imports
 */

// Re-export from individual service modules
export { authService as authAPI } from "./auth.service";
export { userService as usersAPI } from "./user.service";
export { employeeService as employeesAPI } from "./employee.service";
export { projectService as projectsAPI } from "./project.service";
export { roleService as rolesAPI } from "./role.service";

// Re-export http module utilities
export { apiRequest, get, post, put, patch, del as delete } from "./http";
