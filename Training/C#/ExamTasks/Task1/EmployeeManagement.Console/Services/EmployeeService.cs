using System;
using System.Linq;
using EmployeeManagement.Console.Models;
using EmployeeManagement.Console.Services.Interfaces;
using EmployeeManagement.Console.Validators;
using EmployeeManagement.Console.Utilities;

namespace EmployeeManagement.Console.Services
{
    /// <summary>
    /// Business logic for employee management operations
    /// </summary>
    public class EmployeeService : IEmployeeService
    {
        private readonly IFileService _fileService;
        private readonly EmployeeValidator _validator;

        public EmployeeService(IFileService fileService)
        {
            _fileService = fileService;
            _validator = new EmployeeValidator();
        }

        /// <summary>
        /// Retrieves all employees from storage
        /// </summary>
        /// <returns>Array of all employees</returns>
        public Employee[] GetAllEmployees()
        {
            try
            {
                return _fileService.ReadEmployeesFromFile();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error retrieving employees: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Adds a new employee to storage with validation and sorting
        /// </summary>
        /// <param name="employee">The employee to add</param>
        /// <returns>Validation result indicating success or failure</returns>
        public EmployeeValidator.ValidationResult AddEmployee(Employee employee)
        {
            try
            {
                var existingEmployees = GetAllEmployees();

                // Validate employee
                var validationResult = _validator.ValidateEmployee(employee, existingEmployees);
                if (!validationResult.IsValid)
                {
                    return validationResult;
                }

                // Calculate total experience
                employee.TotalExperience = ExperienceCalculator.CalculateExperience(employee.DateOfJoining);

                // Add to list
                var employeeList = existingEmployees.ToList();
                employeeList.Add(employee);

                // Sort by salary (descending)
                var sortedEmployees = employeeList
                    .OrderByDescending(e => e.MonthlySalary)
                    .ToArray();

                // Save to file
                _fileService.WriteEmployeesToFile(sortedEmployees);

                return new EmployeeValidator.ValidationResult { IsValid = true };
            }
            catch (Exception ex)
            {
                return new EmployeeValidator.ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = $"Error adding employee: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Deletes an employee by ID
        /// </summary>
        /// <param name="employeeId">The ID of the employee to delete</param>
        /// <returns>Validation result indicating success or failure</returns>
        public EmployeeValidator.ValidationResult DeleteEmployee(string employeeId)
        {
            try
            {
                var existingEmployees = GetAllEmployees();

                var employeeToDelete = existingEmployees.FirstOrDefault(e => e.EmployeeID == employeeId);

                if (employeeToDelete == null)
                {
                    return new EmployeeValidator.ValidationResult
                    {
                        IsValid = false,
                        ErrorMessage = $"Employee with ID '{employeeId}' not found."
                    };
                }

                var updatedEmployees = existingEmployees
                    .Where(e => e.EmployeeID != employeeId)
                    .ToArray();

                _fileService.WriteEmployeesToFile(updatedEmployees);

                return new EmployeeValidator.ValidationResult { IsValid = true };
            }
            catch (Exception ex)
            {
                return new EmployeeValidator.ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = $"Error deleting employee: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// Checks if an employee with the given ID exists
        /// </summary>
        /// <param name="employeeId">The employee ID to check</param>
        /// <returns>True if employee exists, false otherwise</returns>
        public bool EmployeeExists(string employeeId)
        {
            var employees = GetAllEmployees();
            return employees.Any(e => e.EmployeeID == employeeId);
        }
    }
}
