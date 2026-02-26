// Permission utility functions

/**
 * Check if user has permission for a specific action on a module
 * @param {Object} userPermissions - User's permissions object
 * @param {string} module - Module name (users, employees, projects, roles)
 * @param {string} action - Action type (view, add, edit, delete)
 * @returns {boolean}
 */
export const hasPermission = (userPermissions, module, action) => {
  if (!userPermissions || !userPermissions[module]) {
    return false;
  }

  return userPermissions[module].includes(action);
};

/**
 * Check if user can view a module
 */
export const canView = (userPermissions, module) => {
  return hasPermission(userPermissions, module, "view");
};

/**
 * Check if user can add to a module
 */
export const canAdd = (userPermissions, module) => {
  return hasPermission(userPermissions, module, "add");
};

/**
 * Check if user can edit in a module
 */
export const canEdit = (userPermissions, module) => {
  return hasPermission(userPermissions, module, "edit");
};

/**
 * Check if user can delete from a module
 */
export const canDelete = (userPermissions, module) => {
  return hasPermission(userPermissions, module, "delete");
};

/**
 * Get all modules user can view
 */
export const getViewableModules = (userPermissions) => {
  if (!userPermissions) return [];

  return Object.keys(userPermissions).filter(
    (module) => userPermissions[module]?.includes("view")
  );
};

/**
 * Check if user is Admin
 */
export const isAdmin = (userRole) => {
  return userRole?.toLowerCase() === "admin";
};

/**
 * Get navigation items based on user permissions
 */
export const getNavigationItems = (userPermissions) => {
  const items = [];

  if (canView(userPermissions, "users")) {
    items.push({
      path: "/users",
      label: "Users",
      icon: "👥",
    });
  }

  if (canView(userPermissions, "employees")) {
    items.push({
      path: "/employees",
      label: "Employees",
      icon: "👔",
    });
  }

  if (canView(userPermissions, "projects")) {
    items.push({
      path: "/projects",
      label: "Projects",
      icon: "📁",
    });
  }

  if (canView(userPermissions, "roles")) {
    items.push({
      path: "/roles",
      label: "Roles & Permissions",
      icon: "⚙️",
    });
  }

  return items;
};
