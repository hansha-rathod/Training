/**
 * Validators Module
 * Provides validation and sanitization functions for user input
 */

var Validators = (function () {
    'use strict';

    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - The input string to sanitize
     * @returns {string} Sanitized string
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') {
            return '';
        }

        // Create a temporary div element to use browser's built-in escaping
        var temp = document.createElement('div');
        temp.textContent = input;
        return temp.innerHTML;
    }

    /**
     * Validate and sanitize search input
     * @param {string} searchTerm - The search term to validate
     * @returns {object} Validation result with isValid and sanitized term
     */
    function validateSearchInput(searchTerm) {
        var result = {
            isValid: true,
            sanitizedTerm: '',
            errorMessage: ''
        };

        // Handle null or undefined
        if (!searchTerm) {
            result.sanitizedTerm = '';
            return result;
        }

        // Convert to string if not already
        var searchTermStr = String(searchTerm);

        // Check for maximum length
        if (searchTermStr.length > 100) {
            result.isValid = false;
            result.errorMessage = 'Search term is too long. Maximum length is 100 characters.';
            return result;
        }

        // Sanitize the input
        result.sanitizedTerm = sanitizeInput(searchTermStr.trim());

        return result;
    }

    /**
     * Validate employee data object
     * @param {object} employee - The employee object to validate
     * @returns {object} Validation result with isValid and errors array
     */
    function validateEmployeeData(employee) {
        var result = {
            isValid: true,
            errors: []
        };

        // Check if employee object exists
        if (!employee || typeof employee !== 'object') {
            result.isValid = false;
            result.errors.push('Employee data is not a valid object.');
            return result;
        }

        // Validate required fields
        var requiredFields = [
            'employeeId',
            'name',
            'email',
            'department'
        ];

        requiredFields.forEach(function (field) {
            if (!employee[field]) {
                result.isValid = false;
                result.errors.push('Missing required field: ' + field);
            }
        });

        // Validate email format (basic check)
        if (employee.email && !isValidEmail(employee.email)) {
            result.isValid = false;
            result.errors.push('Invalid email format for employee: ' + employee.name);
        }

        return result;
    }

    /**
     * Basic email validation
     * @param {string} email - The email to validate
     * @returns {boolean} True if email format is valid
     */
    function isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }

        // Basic email regex pattern
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    /**
     * Validate phone number format
     * @param {string} phone - The phone number to validate
     * @returns {boolean} True if phone format is valid
     */
    function isValidPhone(phone) {
        if (!phone) {
            return true; // Phone is optional
        }

        // Basic phone validation - allows digits, spaces, dashes, parentheses, plus
        var phonePattern = /^[\d\s\-\(\)\+]+$/;
        return phonePattern.test(phone);
    }

    /**
     * Validate department name
     * @param {string} department - The department name to validate
     * @returns {boolean} True if department is valid
     */
    function isValidDepartment(department) {
        if (!department) {
            return false;
        }

        var validDepartments = [
            'Sales',
            'Marketing',
            'Development',
            'QA',
            'HR',
            'SEO'
        ];

        return validDepartments.indexOf(department) !== -1;
    }

    /**
     * Validate gender value
     * @param {string} gender - The gender value to validate
     * @returns {boolean} True if gender is valid
     */
    function isValidGender(gender) {
        if (!gender) {
            return false;
        }

        var normalizedGender = gender.toUpperCase();
        return normalizedGender === 'M' || normalizedGender === 'F';
    }

    /**
     * Sanitize HTML output
     * @param {string} html - The HTML string to sanitize
     * @returns {string} Sanitized HTML string
     */
    function sanitizeHTML(html) {
        if (!html) {
            return '';
        }

        var temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    /**
     * Escape special characters for regex
     * @param {string} string - The string to escape
     * @returns {string} Escaped string
     */
    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Validate page size value
     * @param {number} pageSize - The page size to validate
     * @returns {boolean} True if page size is valid
     */
    function isValidPageSize(pageSize) {
        var validPageSizes = [5, 10, 20, 50];
        return validPageSizes.indexOf(pageSize) !== -1;
    }

    /**
     * Validate page number
     * @param {number} pageNumber - The page number to validate
     * @param {number} totalPages - Total number of pages
     * @returns {boolean} True if page number is valid
     */
    function isValidPageNumber(pageNumber, totalPages) {
        if (!pageNumber || pageNumber < 1) {
            return false;
        }

        if (totalPages && pageNumber > totalPages) {
            return false;
        }

        return true;
    }

    // Public API
    return {
        sanitizeInput: sanitizeInput,
        validateSearchInput: validateSearchInput,
        validateEmployeeData: validateEmployeeData,
        isValidEmail: isValidEmail,
        isValidPhone: isValidPhone,
        isValidDepartment: isValidDepartment,
        isValidGender: isValidGender,
        sanitizeHTML: sanitizeHTML,
        escapeRegex: escapeRegex,
        isValidPageSize: isValidPageSize,
        isValidPageNumber: isValidPageNumber
    };

})();
