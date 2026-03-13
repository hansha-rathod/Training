using System;
using System.Configuration;
using System.IO;
using Newtonsoft.Json;
using EmployeeManagement.Console.Models;
using EmployeeManagement.Console.Services.Interfaces;

namespace EmployeeManagement.Console.Services
{
    /// <summary>
    /// Handles file I/O operations for employee data storage
    /// </summary>
    public class FileService : IFileService
    {
        private readonly string _basePath;
        private readonly string _fileName;

        public FileService()
        {
            _basePath = ConfigurationManager.AppSettings["JsonFilePath"];
            _fileName = ConfigurationManager.AppSettings["JsonFileName"];
        }

        /// <summary>
        /// Gets the full path to the JSON file with current date in filename
        /// </summary>
        /// <returns>Full file path</returns>
        public string GetJsonFilePath()
        {
            var currentDate = DateTime.Now.ToString("MMddyyyy");
            var directory = Path.GetDirectoryName(_basePath);

            // Create directory if it doesn't exist
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            return Path.Combine(_basePath, $"{_fileName}_{currentDate}.json");
        }

        /// <summary>
        /// Reads all employees from the JSON file
        /// </summary>
        /// <returns>Array of employees, or empty array if file doesn't exist</returns>
        public Employee[] ReadEmployeesFromFile()
        {
            try
            {
                var filePath = GetJsonFilePath();

                if (!File.Exists(filePath))
                {
                    return new Employee[0];
                }

                var json = File.ReadAllText(filePath);
                if (string.IsNullOrWhiteSpace(json))
                {
                    return new Employee[0];
                }

                var employees = JsonConvert.DeserializeObject<Employee[]>(json);
                return employees ?? new Employee[0];
            }
            catch (Exception ex)
            {
                throw new Exception($"Error reading employee file: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Writes employees to the JSON file
        /// </summary>
        /// <param name="employees">Array of employees to write</param>
        public void WriteEmployeesToFile(Employee[] employees)
        {
            try
            {
                var filePath = GetJsonFilePath();
                var settings = new JsonSerializerSettings
                {
                    Formatting = Formatting.Indented,
                    NullValueHandling = NullValueHandling.Ignore
                };

                var json = JsonConvert.SerializeObject(employees, settings);
                File.WriteAllText(filePath, json);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error writing employee file: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Checks if the JSON file exists
        /// </summary>
        /// <returns>True if file exists, false otherwise</returns>
        public bool FileExists()
        {
            return File.Exists(GetJsonFilePath());
        }
    }
}
