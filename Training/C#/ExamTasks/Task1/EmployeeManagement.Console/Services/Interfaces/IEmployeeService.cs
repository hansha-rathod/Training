using EmployeeManagement.Console.Models;
using EmployeeManagement.Console.Validators;

namespace EmployeeManagement.Console.Services.Interfaces
{
    /// <summary>
    /// Interface for employee management operations
    /// </summary>
    public interface IEmployeeService
    {
        /// <summary>
        /// Retrieves all employees from storage
        /// </summary>
        /// <returns>Array of all employees</returns>
        Employee[] GetAllEmployees();

        /// <summary>
        /// Adds a new employee to storage
        /// </summary>
        /// <param name="employee">The employee to add</param>
        /// <returns>Validation result indicating success or failure</returns>
        EmployeeValidator.ValidationResult AddEmployee(Employee employee);

        /// <summary>
        /// Deletes an employee by ID
        /// </summary>
        /// <param name="employeeId">The ID of the employee to delete</param>
        /// <returns>Validation result indicating success or failure</returns>
        EmployeeValidator.ValidationResult DeleteEmployee(string employeeId);

        /// <summary>
        /// Checks if an employee with the given ID exists
        /// </summary>
        /// <param name="employeeId">The employee ID to check</param>
        /// <returns>True if employee exists, false otherwise</returns>
        bool EmployeeExists(string employeeId);
    }
}
