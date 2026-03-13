/**
 * Main Application Module
 * Employee Management System - Part 2
 * Handles UI interactions, event handlers, and business logic
 */

var EmployeeApp = (function () {
    'use strict';

    // Private variables
    var allEmployees = [];
    var filteredEmployees = [];
    var currentPage = 1;
    var pageSize = 10;
    var sortColumn = 'name';
    var sortDirection = 'asc';
    var currentSearchTerm = '';
    var searchTimeout = null;

    // jQuery selectors cache
    var $loadingSpinner;
    var $errorAlert;
    var $errorMessage;
    var $employeeTableContainer;
    var $employeeTableBody;
    var $noRecordsMessage;
    var $searchInput;
    var $clearSearchBtn;
    var $pagination;
    var $pageSizeSelect;
    var $recordsInfo;
    var $employeeDetailModal;

    /**
     * Initialize event handlers
     */
    function initializeEventHandlers() {
        // Cache jQuery selectors
        $loadingSpinner = $('#loadingSpinner');
        $errorAlert = $('#errorAlert');
        $errorMessage = $('#errorMessage');
        $employeeTableContainer = $('#employeeTableContainer');
        $employeeTableBody = $('#employeeTableBody');
        $noRecordsMessage = $('#noRecordsMessage');
        $searchInput = $('#searchInput');
        $clearSearchBtn = $('#clearSearchBtn');
        $pagination = $('#pagination');
        $pageSizeSelect = $('#pageSizeSelect');
        $recordsInfo = $('#recordsInfo');
        $employeeDetailModal = $('#employeeDetailModal');

        // Search input event with debouncing
        $searchInput.on('keyup', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function () {
                handleSearch();
            }, 300);
        });

        // Clear search button
        $clearSearchBtn.on('click', function () {
            $searchInput.val('');
            handleSearch();
        });

        // Page size change event
        $pageSizeSelect.on('change', function () {
            pageSize = parseInt($(this).val(), 10);
            currentPage = 1;
            renderEmployeeTable();
        });

        // Sortable column headers
        $('.sortable').on('click', function () {
            var column = $(this).data('column');
            handleSort(column);
        });

        // Employee detail button (event delegation for dynamic elements)
        $employeeTableBody.on('click', '.btn-view', function (e) {
            e.stopPropagation();
            var employeeId = $(this).data('employee-id');
            showEmployeeDetail(employeeId);
        });

        // Row click event (alternative way to view details)
        $employeeTableBody.on('click', 'tr', function () {
            var $btn = $(this).find('.btn-view');
            if ($btn.length > 0) {
                var employeeId = $btn.data('employee-id');
                showEmployeeDetail(employeeId);
            }
        });
    }

    /**
     * Load employee data from JSON file
     */
    function loadEmployeeData() {
        showLoading();

        EmployeeService.fetchEmployees()
            .then(function (data) {
                allEmployees = data;
                filteredEmployees = allEmployees.slice();
                hideLoading();
                renderEmployeeTable();
            })
            .catch(function (error) {
                hideLoading();
                showError(error.message);
            });
    }

    /**
     * Handle search functionality
     */
    function handleSearch() {
        var searchTerm = $searchInput.val();
        var validation = Validators.validateSearchInput(searchTerm);

        if (!validation.isValid) {
            showError(validation.errorMessage);
            return;
        }

        currentSearchTerm = validation.sanitizedTerm;
        currentPage = 1; // Reset to first page

        if (currentSearchTerm) {
            filteredEmployees = EmployeeService.filterEmployees(allEmployees, currentSearchTerm);
        } else {
            filteredEmployees = allEmployees.slice();
        }

        renderEmployeeTable();
    }

    /**
     * Handle column sorting
     * @param {string} column - The column to sort by
     */
    function handleSort(column) {
        // Toggle sort direction if clicking the same column
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        // Update sort indicators
        updateSortIndicators();

        // Sort the filtered employees
        filteredEmployees = EmployeeService.sortEmployees(filteredEmployees, sortColumn, sortDirection);

        // Re-render the table
        renderEmployeeTable();
    }

    /**
     * Update sort indicators in the table header
     */
    function updateSortIndicators() {
        // Remove all sort classes
        $('.sortable').removeClass('asc desc');

        // Add appropriate class to current sort column
        var $currentColumn = $('.sortable[data-column="' + sortColumn + '"]');
        $currentColumn.addClass(sortDirection);

        // Update icon
        $('.sortable .sort-icon').removeClass('fa-sort-up fa-sort-down').addClass('fa-sort');
        var $currentIcon = $currentColumn.find('.sort-icon');
        $currentIcon.removeClass('fa-sort').addClass(sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down');
    }

    /**
     * Render the employee table
     */
    function renderEmployeeTable() {
        // Clear the table body
        $employeeTableBody.empty();

        // Check if there are any employees to display
        if (filteredEmployees.length === 0) {
            $noRecordsMessage.removeClass('d-none');
            $pagination.empty();
            $recordsInfo.text('');
            return;
        }

        $noRecordsMessage.addClass('d-none');

        // Get paginated employees
        var paginationData = EmployeeService.getPaginatedEmployees(filteredEmployees, currentPage, pageSize);
        var paginatedEmployees = paginationData.paginatedEmployees;

        // Render each employee row
        paginatedEmployees.forEach(function (employee, index) {
            var rowNumber = paginationData.startIndex + index + 1;
            var $row = createEmployeeRow(employee, rowNumber);
            $employeeTableBody.append($row);
        });

        // Update pagination controls
        renderPagination(paginationData);

        // Update records info
        updateRecordsInfo(paginationData);
    }

    /**
     * Create a table row for an employee
     * @param {object} employee - The employee object
     * @param {number} rowNumber - The row number
     * @returns {jQuery} jQuery object representing the table row
     */
    function createEmployeeRow(employee, rowNumber) {
        var gender = employee.gender ? employee.gender.toUpperCase() : '';
        var genderDisplay = gender === 'M' ? 'M' : (gender === 'F' ? 'F' : '');
        var departmentClass = EmployeeService.getDepartmentColorClass((employee.department).toUpperCase());
        var departmentStyle = EmployeeService.getDepartmentColorStyle(employee.department);

        var $row = $('<tr>').attr('data-employee-id', employee.employeeId);

        $row.append($('<td>').text(rowNumber));
        $row.append($('<td>').text(employee.name || ''));
        $row.append($('<td>').html('<span class="badge badge-secondary badge-gender">' + Validators.sanitizeHTML(genderDisplay) + '</span>'));
        $row.append($('<td>').html('<span class="badge ' + departmentClass + '" style="' + departmentStyle + '">' + Validators.sanitizeHTML(employee.department || '') + '</span>'));
        $row.append($('<td>').addClass('text-ellipsis').text(employee.email || ''));
        $row.append($('<td>').text(employee.phone || ''));
        $row.append($('<td>').addClass('text-center').html(
            '<button class="btn btn-sm btn-primary btn-view" data-employee-id="' + employee.employeeId + '" title="View Details">' +
            '<i class="fas fa-eye"></i>' +
            '</button>'
        ));

        return $row;
    }

    /**
     * Render pagination controls
     * @param {object} paginationData - Pagination information
     */
    function renderPagination(paginationData) {
        $pagination.empty();

        var totalPages = paginationData.totalPages;
        var currentPageNum = paginationData.currentPage;

        // Previous button
        var $prevLi = $('<li>').addClass('page-item' + (currentPageNum === 1 ? ' disabled' : ''));
        $prevLi.append($('<a>').addClass('page-link').attr('href', '#').attr('aria-label', 'Previous')
            .html('<span aria-hidden="true">&laquo;</span>')
            .on('click', function (e) {
                e.preventDefault();
                if (currentPageNum > 1) {
                    currentPage--;
                    renderEmployeeTable();
                }
            }));
        $pagination.append($prevLi);

        // Page number buttons
        var maxButtonsToShow = 5;
        var startPage = Math.max(1, currentPageNum - Math.floor(maxButtonsToShow / 2));
        var endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

        if (endPage - startPage < maxButtonsToShow - 1) {
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }

        if (startPage > 1) {
            $pagination.append(createPageButton(1));
            if (startPage > 2) {
                $pagination.append($('<li>').addClass('page-item disabled').append($('<span>').addClass('page-link').text('...')));
            }
        }

        for (var i = startPage; i <= endPage; i++) {
            $pagination.append(createPageButton(i));
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                $pagination.append($('<li>').addClass('page-item disabled').append($('<span>').addClass('page-link').text('...')));
            }
            $pagination.append(createPageButton(totalPages));
        }

        // Next button
        var $nextLi = $('<li>').addClass('page-item' + (currentPageNum === totalPages ? ' disabled' : ''));
        $nextLi.append($('<a>').addClass('page-link').attr('href', '#').attr('aria-label', 'Next')
            .html('<span aria-hidden="true">&raquo;</span>')
            .on('click', function (e) {
                e.preventDefault();
                if (currentPageNum < totalPages) {
                    currentPage++;
                    renderEmployeeTable();
                }
            }));
        $pagination.append($nextLi);
    }

    /**
     * Create a page button for pagination
     * @param {number} pageNumber - The page number
     * @returns {jQuery} jQuery object representing the page button
     */
    function createPageButton(pageNumber) {
        var $li = $('<li>').addClass('page-item' + (pageNumber === currentPage ? ' active' : ''));
        $li.append($('<a>').addClass('page-link').attr('href', '#').text(pageNumber)
            .on('click', function (e) {
                e.preventDefault();
                currentPage = pageNumber;
                renderEmployeeTable();
            }));
        return $li;
    }

    /**
     * Update records information display
     * @param {object} paginationData - Pagination information
     */
    function updateRecordsInfo(paginationData) {
        var start = paginationData.totalRecords > 0 ? paginationData.startIndex + 1 : 0;
        var end = Math.min(paginationData.endIndex, paginationData.totalRecords);
        var total = paginationData.totalRecords;

        $recordsInfo.text('Showing ' + start + ' to ' + end + ' of ' + total + ' records');
    }

    /**
     * Show employee detail modal
     * @param {string|number} employeeId - The employee ID
     */
    function showEmployeeDetail(employeeId) {
        var employee = EmployeeService.findEmployeeById(allEmployees, employeeId);

        if (!employee) {
            showError('Employee not found with ID: ' + employeeId);
            return;
        }

        // Populate modal fields
        $('#modalEmployeeId').text(employee.employeeId || '');
        $('#modalName').text(employee.name || '');
        $('#modalGender').text(employee.gender ? (employee.gender.toUpperCase() === 'M' ? 'Male' : 'Female') : '');
        $('#modalDOB').text(DateFormatter.formatDate(employee.dob));
        $('#modalDepartment').html('<span class="badge ' + EmployeeService.getDepartmentColorClass(employee.department) + '" style="' + EmployeeService.getDepartmentColorStyle(employee.department) + '">' + Validators.sanitizeHTML(employee.department || '') + '</span>');
        $('#modalDesignation').text(employee.designation || '');
        $('#modalEmail').text(employee.email || '');
        $('#modalPhone').text(employee.phone || '');
        $('#modalCity').text(employee.city || '');
        $('#modalState').text(employee.state || '');
        $('#modalPostcode').text(employee.postcode || '');
        $('#modalDOJ').text(DateFormatter.formatDate(employee.dateOfJoining));
        $('#modalExperience').text((employee.totalExperience || employee.totalExperience === 0 ? employee.totalExperience + ' Years' : DateFormatter.calculateExperience(employee.dateOfJoining) + ' Years'));
        $('#modalSalary').text(employee.monthlySalary ? '$' + parseFloat(employee.monthlySalary).toFixed(2) : '');
        $('#modalRemarks').text(employee.remarks || 'No remarks available.');

        // Show the modal
        $employeeDetailModal.modal('show');
    }

    /**
     * Show loading spinner
     */
    function showLoading() {
        $loadingSpinner.removeClass('d-none');
        $employeeTableContainer.addClass('d-none');
        $errorAlert.addClass('d-none');
    }

    /**
     * Hide loading spinner
     */
    function hideLoading() {
        $loadingSpinner.addClass('d-none');
        $employeeTableContainer.removeClass('d-none');
    }

    /**
     * Show error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        $errorMessage.text(message);
        $errorAlert.removeClass('d-none');
        $employeeTableContainer.addClass('d-none');

        // Auto-hide error after 10 seconds
        setTimeout(function () {
            $errorAlert.addClass('d-none');
        }, 10000);
    }

    /**
     * Initialize the application
     */
    function init() {
        $(document).ready(function () {
            initializeEventHandlers();
            loadEmployeeData();
        });
    }

    // Public API
    return {
        init: init
    };

})();

// Initialize the application when DOM is ready
EmployeeApp.init();
