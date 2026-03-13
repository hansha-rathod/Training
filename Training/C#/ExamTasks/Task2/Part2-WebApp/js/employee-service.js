/**
 * Employee Service Module
 * Handles Ajax calls to fetch employee data from JSON file
 */

var EmployeeService = (function () {
    'use strict';

    // Configuration
    var config = {
        jsonFilePath: '../../EmployeeData_03132026.json',
        timeout: 10000 // 10 seconds
    };

    /**
     * Convert department index to department name
     * @param {number|string} department - Department index or name
     * @returns {string} Department name
     */
    function getDepartmentName(department) {
        // If it's already a string, return it
        if (typeof department === 'string') {
            return department;
        }

        // Convert numeric index to department name (matching C# enum)
        var departmentMap = {
            0: 'Sales',
            1: 'Marketing',
            2: 'Development',
            3: 'QA',
            4: 'HR',
            5: 'SEO'
        };

        return departmentMap[department] || 'Unknown';
    }

    /**
     * Normalize employee data (convert department index to name)
     * @param {Array} employees - Array of employee objects
     * @returns {Array} Normalized array of employee objects
     */
    function normalizeEmployeeData(employees) {
        if (!Array.isArray(employees)) {
            return employees;
        }

        return employees.map(function (employee) {
            // Convert department index to name if it's a number
            if (typeof employee.department === 'number') {
                employee.department = getDepartmentName(employee.department);
            }
            return employee;
        });
    }

    /**
     * Get department color class based on department name
     * @param {string} department - The department name
     * @returns {string} CSS class name for department badge
     */
    function getDepartmentColorClass(department) {
        if (!department) {
            return 'badge-secondary';
        }

        // Handle numeric department
        var deptName = getDepartmentName(department);
          deptName = deptName.toLowerCase();

        // Department to color mapping (matching C# enum)
        var colorMap = {
            'Sales': 'badge-sales',
            'Marketing': 'badge-marketing',
            'Development': 'badge-development',
            'QA': 'badge-qa',
            'HR': 'badge-hr',
            'SEO': 'badge-seo'
        };

        // Return the color class or default secondary
        return colorMap[deptName] || 'badge-secondary';
    }

    /**
     * Get department inline style color (fallback)
     * @param {string} department - The department name
     * @returns {string} Inline style for department badge
     */
    function getDepartmentColorStyle(department) {
        if (!department) {
            return 'background-color: #6c757d; color: white;';
        }

        var deptName = getDepartmentName(department).toLowerCase();

        // Department to color mapping (matching C# enum)
        var colorMap = {
            'sales': 'background-color: #ff0000; color: white;',
            'marketing': 'background-color: #005400; color: white;',
            'development': 'background-color: #000000; color: white;',
            'qa': 'background-color: #0000ff; color: white;',
            'hr': 'background-color: #ff7f50; color: white;',
            'seo': 'background-color: #fe00ef; color: white;'
        };

        return colorMap[deptName] || 'background-color: #6c757d; color: white;';
    }

    /**
     * Fetch all employees from JSON file using Ajax
     * @returns {Promise} Promise that resolves with employee data
     */
    function fetchEmployees() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: config.jsonFilePath,
                type: 'GET',
                dataType: 'json',
                timeout: config.timeout,
                beforeSend: function () {
                    // Optional: Show loading indicator
                    console.log('Fetching employee data...');
                },
                success: function (data) {
                    console.log('Employee data fetched successfully:', data);

                    // Validate that data is an array
                    if (!Array.isArray(data)) {
                        // If data has an employees property, use that
                        if (data.employees && Array.isArray(data.employees)) {
                            resolve(normalizeEmployeeData(data.employees));
                        } else {
                            reject(new Error('Invalid data format: Expected an array of employees'));
                        }
                    } else {
                        // Normalize employee data (convert department index to name)
                        resolve(normalizeEmployeeData(data));
                    }
                },
                error: function (xhr, status, error) {
                    var errorMessage = 'Failed to fetch employee data. ';

                    switch (status) {
                        case 'timeout':
                            errorMessage += 'Request timed out. Please try again.';
                            break;
                        case 'error':
                            if (xhr.status === 404) {
                                errorMessage += 'JSON file not found. Please ensure the file exists at: ' + config.jsonFilePath;
                            } else if (xhr.status === 0) {
                                errorMessage += 'Network error. Please check your connection or use a web server (CORS restriction).';
                            } else {
                                errorMessage += 'Server error: ' + xhr.status;
                            }
                            break;
                        case 'parsererror':
                            errorMessage += 'Invalid JSON format. Please check the file structure.';
                            break;
                        default:
                            errorMessage += error || 'Unknown error occurred.';
                    }

                    console.error('Ajax error:', status, error);
                    reject(new Error(errorMessage));
                }
            });
        });
    }

    /**
     * Find employee by ID
     * @param {Array} employees - Array of employee objects
     * @param {string|number} employeeId - The employee ID to search for
     * @returns {object|null} Employee object or null if not found
     */
    function findEmployeeById(employees, employeeId) {
        if (!Array.isArray(employees) || !employeeId) {
            return null;
        }

        // Convert employeeId to string for comparison
        var searchId = String(employeeId);

        return employees.find(function (employee) {
            return String(employee.employeeId) === searchId;
        }) || null;
    }

    /**
     * Filter employees by search term
     * @param {Array} employees - Array of employee objects
     * @param {string} searchTerm - The search term to filter by
     * @returns {Array} Filtered array of employees
     */
    function filterEmployees(employees, searchTerm) {
        if (!Array.isArray(employees) || !searchTerm) {
            return employees || [];
        }

        var term = searchTerm.toLowerCase().trim();

        return employees.filter(function (employee) {
            // Search in multiple fields
            var name = employee.name ? employee.name.toLowerCase() : '';
            var email = employee.email ? employee.email.toLowerCase() : '';
            var department = employee.department ? employee.department.toLowerCase() : '';
            var phone = employee.phone ? employee.phone.toLowerCase() : '';
            var city = employee.city ? employee.city.toLowerCase() : '';
            var state = employee.state ? employee.state.toLowerCase() : '';
            var designation = employee.designation ? employee.designation.toLowerCase() : '';

            return name.indexOf(term) !== -1 ||
                   email.indexOf(term) !== -1 ||
                   department.indexOf(term) !== -1 ||
                   phone.indexOf(term) !== -1 ||
                   city.indexOf(term) !== -1 ||
                   state.indexOf(term) !== -1 ||
                   designation.indexOf(term) !== -1;
        });
    }

    /**
     * Sort employees by column
     * @param {Array} employees - Array of employee objects
     * @param {string} column - The column to sort by
     * @param {string} direction - Sort direction ('asc' or 'desc')
     * @returns {Array} Sorted array of employees
     */
    function sortEmployees(employees, column, direction) {
        if (!Array.isArray(employees)) {
            return [];
        }

        // Create a copy to avoid mutating the original array
        var sortedEmployees = employees.slice();

        sortedEmployees.sort(function (a, b) {
            var valueA = a[column] || '';
            var valueB = b[column] || '';

            // Handle different data types
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            // Compare values
            if (valueA < valueB) {
                return direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return sortedEmployees;
    }

    /**
     * Get paginated subset of employees
     * @param {Array} employees - Array of employee objects
     * @param {number} pageNumber - The page number (1-based)
     * @param {number} pageSize - The number of records per page
     * @returns {object} Object with paginatedEmployees and pagination info
     */
    function getPaginatedEmployees(employees, pageNumber, pageSize) {
        if (!Array.isArray(employees)) {
            return {
                paginatedEmployees: [],
                totalRecords: 0,
                totalPages: 0,
                currentPage: 1,
                pageSize: pageSize
            };
        }

        var totalRecords = employees.length;
        var totalPages = Math.ceil(totalRecords / pageSize) || 1;

        // Validate page number
        if (pageNumber < 1) {
            pageNumber = 1;
        }
        if (pageNumber > totalPages && totalPages > 0) {
            pageNumber = totalPages;
        }

        var startIndex = (pageNumber - 1) * pageSize;
        var endIndex = startIndex + pageSize;
        var paginatedEmployees = employees.slice(startIndex, endIndex);

        return {
            paginatedEmployees: paginatedEmployees,
            totalRecords: totalRecords,
            totalPages: totalPages,
            currentPage: pageNumber,
            pageSize: pageSize,
            startIndex: startIndex,
            endIndex: endIndex
        };
    }

    /**
     * Update the JSON file path configuration
     * @param {string} newPath - New path to the JSON file
     */
    function setJsonFilePath(newPath) {
        if (newPath && typeof newPath === 'string') {
            config.jsonFilePath = newPath;
        }
    }

    /**
     * Get the current JSON file path
     * @returns {string} Current JSON file path
     */
    function getJsonFilePath() {
        return config.jsonFilePath;
    }

    // Public API
    return {
        fetchEmployees: fetchEmployees,
        findEmployeeById: findEmployeeById,
        filterEmployees: filterEmployees,
        sortEmployees: sortEmployees,
        getPaginatedEmployees: getPaginatedEmployees,
        getDepartmentColorClass: getDepartmentColorClass,
        getDepartmentColorStyle: getDepartmentColorStyle,
        getDepartmentName: getDepartmentName,
        normalizeEmployeeData: normalizeEmployeeData,
        setJsonFilePath: setJsonFilePath,
        getJsonFilePath: getJsonFilePath
    };

})();
