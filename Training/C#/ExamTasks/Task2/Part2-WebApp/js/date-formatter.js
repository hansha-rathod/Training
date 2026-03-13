/**
 * Date Formatter Module
 * Provides date formatting functionality for employee dates
 * Format: dd-MMM-yyyy (e.g., 04-Mar-2022)
 */

var DateFormatter = (function () {
    'use strict';

    // Private array of month abbreviations
    var monthAbbreviations = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    /**
     * Pad a number with leading zeros
     * @param {number} num - The number to pad
     * @param {number} size - The desired length
     * @returns {string} The padded number
     */
    function padNumber(num, size) {
        var s = num.toString();
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }

    /**
     * Format a date string to dd-MMM-yyyy format
     * @param {string} dateString - The date string to format
     * @returns {string} Formatted date string or empty string if invalid
     */
    function formatDate(dateString) {
        // Handle null, undefined, or empty string
        if (!dateString) {
            return '';
        }

        try {
            // Parse the date string
            var date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) {
                console.warn('Invalid date: ' + dateString);
                return '';
            }

            // Extract date components
            var day = date.getDate();
            var month = date.getMonth();
            var year = date.getFullYear();

            // Format: dd-MMM-yyyy (e.g., 04-Mar-2022)
            var formattedDate = padNumber(day, 2) + '-' +
                               monthAbbreviations[month] + '-' +
                               year;

            return formattedDate;
        } catch (error) {
            console.error('Error formatting date: ' + dateString, error);
            return '';
        }
    }

    /**
     * Format a date to display format with time
     * @param {string} dateString - The date string to format
     * @returns {string} Formatted date-time string
     */
    function formatDateTime(dateString) {
        if (!dateString) {
            return '';
        }

        try {
            var date = new Date(dateString);

            if (isNaN(date.getTime())) {
                return '';
            }

            var day = padNumber(date.getDate(), 2);
            var month = monthAbbreviations[date.getMonth()];
            var year = date.getFullYear();
            var hours = padNumber(date.getHours(), 2);
            var minutes = padNumber(date.getMinutes(), 2);
            var seconds = padNumber(date.getSeconds(), 2);

            return day + '-' + month + '-' + year + ' ' +
                   hours + ':' + minutes + ':' + seconds;
        } catch (error) {
            console.error('Error formatting datetime: ' + dateString, error);
            return '';
        }
    }

    /**
     * Calculate the difference in years between two dates
     * @param {string} startDate - The start date (e.g., Date of Joining)
     * @returns {number} Total experience in years
     */
    function calculateExperience(startDate) {
        if (!startDate) {
            return 0;
        }

        try {
            var start = new Date(startDate);
            var today = new Date();

            if (isNaN(start.getTime())) {
                return 0;
            }

            // Calculate the difference in years
            var years = today.getFullYear() - start.getFullYear();
            var monthDiff = today.getMonth() - start.getMonth();

            // Adjust if the current month is before the start month
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < start.getDate())) {
                years--;
            }

            return years;
        } catch (error) {
            console.error('Error calculating experience: ' + startDate, error);
            return 0;
        }
    }

    /**
     * Validate if a date string is valid
     * @param {string} dateString - The date string to validate
     * @returns {boolean} True if valid, false otherwise
     */
    function isValidDate(dateString) {
        if (!dateString) {
            return false;
        }

        var date = new Date(dateString);
        return !isNaN(date.getTime());
    }

    // Public API
    return {
        formatDate: formatDate,
        formatDateTime: formatDateTime,
        calculateExperience: calculateExperience,
        isValidDate: isValidDate
    };

})();
