using EmployeeManagement.Console.Models;

namespace EmployeeManagement.Console.Services.Interfaces
{
    /// <summary>
    /// Interface for file I/O operations
    /// </summary>
    public interface IFileService
    {
        /// <summary>
        /// Gets the full path to the JSON file
        /// </summary>
        /// <returns>Full file path including date in filename</returns>
        string GetJsonFilePath();

        /// <summary>
        /// Reads all employees from the JSON file
        /// </summary>
        /// <returns>Array of employees, or empty array if file doesn't exist</returns>
        Employee[] ReadEmployeesFromFile();

        /// <summary>
        /// Writes employees to the JSON file
        /// </summary>
        /// <param name="employees">Array of employees to write</param>
        void WriteEmployeesToFile(Employee[] employees);

        /// <summary>
        /// Checks if the JSON file exists
        /// </summary>
        /// <returns>True if file exists, false otherwise</returns>
        bool FileExists();
    }
}
