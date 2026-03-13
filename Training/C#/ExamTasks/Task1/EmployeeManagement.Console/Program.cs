using System;
using EmployeeManagement.Console.Services;
using EmployeeManagement.Console.Services.Interfaces;

namespace EmployeeManagement.Console
{
    /// <summary>
    /// Main entry point for the Employee Management Console Application
    /// </summary>
    class Program
    {
        private static IEmployeeService _employeeService;
        private static IFileService _fileService;

        static void Main(string[] args)
        {
            try
            {
                // Initialize services
                _fileService = new FileService();
                _employeeService = new EmployeeService(_fileService);

                // Display welcome message
                DisplayWelcomeMessage();

                // Start menu loop
                RunMenuLoop();
            }
            catch (Exception ex)
            {
                DisplayError($"Application error: {ex.Message}");
                System.Console.WriteLine("\nPress any key to exit...");
                System.Console.ReadKey();
            }
        }

        /// <summary>
        /// Displays the welcome message and header
        /// </summary>
        private static void DisplayWelcomeMessage()
        {
            System.Console.Clear();
            System.Console.WriteLine("===========================================");
            System.Console.WriteLine("|    EMPLOYEE MANAGEMENT SYSTEM             |");
            System.Console.WriteLine("===========================================");
            System.Console.WriteLine();
        }

        /// <summary>
        /// Main menu loop that handles user interaction
        /// </summary>
        private static void RunMenuLoop()
        {
            bool continueRunning = true;

            while (continueRunning)
            {
                DisplayMenu();
                var choice = GetUserChoice();

                switch (choice)
                {
                    case "1":
                        AddNewEmployee();
                        break;
                    case "2":
                        DeleteEmployee();
                        break;
                    case "3":
                        continueRunning = false;
                        System.Console.WriteLine("\nThank you for using Employee Management System. Goodbye!");
                        break;
                    default:
                        DisplayError("Invalid choice. Please select 1, 2, or 3.");
                        break;
                }

                if (continueRunning)
                {
                    System.Console.WriteLine("\nPress any key to continue...");
                    System.Console.ReadKey();
                    DisplayWelcomeMessage();
                }
            }
        }

        /// <summary>
        /// Displays the main menu options
        /// </summary>
        private static void DisplayMenu()
        {
            System.Console.WriteLine("--- MAIN MENU ---");
            System.Console.WriteLine("1. Add New Employee");
            System.Console.WriteLine("2. Delete Employee");
            System.Console.WriteLine("3. Exit");
            System.Console.WriteLine();
            System.Console.Write("Please enter your choice (1-3): ");
        }

        /// <summary>
        /// Gets and validates user's menu choice
        /// </summary>
        /// <returns>User's choice as a string</returns>
        private static string GetUserChoice()
        {
            return System.Console.ReadLine()?.Trim() ?? "";
        }

        /// <summary>
        /// Handles adding a new employee
        /// </summary>
        private static void AddNewEmployee()
        {
            try
            {
                System.Console.WriteLine("\n--- ADD NEW EMPLOYEE ---");
                System.Console.WriteLine("Please enter the following details:\n");

                var employee = new Models.Employee
                {
                    EmployeeID = GetInput("Employee ID"),
                    Name = GetInput("Name"),
                    DOB = GetDateInput("Date of Birth (DD-MM-YYYY)"),
                    Gender = GetGenderInput(),
                    Designation = GetInput("Designation"),
                    City = GetInput("City"),
                    State = GetInput("State"),
                    Postcode = GetInput("Postcode"),
                    Phone = GetInput("Phone"),
                    Email = GetInput("Email"),
                    DateOfJoining = GetDateInput("Date of Joining (DD-MM-YYYY)"),
                    Remarks = GetInput("Remarks (optional)", true),
                    Department = GetDepartmentInput(),
                    MonthlySalary = GetDecimalInput("Monthly Salary")
                };

                var result = _employeeService.AddEmployee(employee);

                if (result.IsValid)
                {
                    System.Console.WriteLine("\n✓ Employee added successfully!");
                    System.Console.WriteLine($"  ID: {employee.EmployeeID}");
                    System.Console.WriteLine($"  Name: {employee.Name}");
                    System.Console.WriteLine($"  Department: {employee.Department}");
                    System.Console.WriteLine($"  Experience: {employee.TotalExperience}");
                }
                else
                {
                    DisplayError(result.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                DisplayError($"Error adding employee: {ex.Message}");
            }
        }

        /// <summary>
        /// Handles deleting an employee
        /// </summary>
        private static void DeleteEmployee()
        {
            try
            {
                System.Console.WriteLine("\n--- DELETE EMPLOYEE ---");
                System.Console.WriteLine();

                var employeeId = GetInput("Please provide the employee ID which you want to delete");

                var result = _employeeService.DeleteEmployee(employeeId);

                if (result.IsValid)
                {
                    System.Console.WriteLine($"\n✓ Employee with ID '{employeeId}' deleted successfully!");
                }
                else
                {
                    DisplayError(result.ErrorMessage);
                }
            }
            catch (Exception ex)
            {
                DisplayError($"Error deleting employee: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets a string input from the user
        /// </summary>
        /// <param name="prompt">The prompt to display</param>
        /// <param name="optional">Whether the field is optional</param>
        /// <returns>User input as a string</returns>
        private static string GetInput(string prompt, bool optional = false)
        {
            System.Console.Write($"{prompt}: ");
            var input = System.Console.ReadLine()?.Trim() ?? "";

            if (!optional && string.IsNullOrWhiteSpace(input))
            {
                throw new ArgumentException($"{prompt} cannot be empty.");
            }

            return input;
        }

        /// <summary>
        /// Gets a date input from the user with validation
        /// </summary>
        /// <param name="prompt">The prompt to display</param>
        /// <returns>Valid DateTime object</returns>
        private static DateTime GetDateInput(string prompt)
        {
            while (true)
            {
                try
                {
                    System.Console.Write($"{prompt}: ");
                    var input = System.Console.ReadLine()?.Trim();

                    if (DateTime.TryParse(input, out var date))
                    {
                        return date;
                    }

                    System.Console.WriteLine("Invalid date format. Please try again.");
                }
                catch
                {
                    System.Console.WriteLine("Invalid date format. Please try again.");
                }
            }
        }

        /// <summary>
        /// Gets gender input from the user with validation
        /// </summary>
        /// <returns>'F' or 'M'</returns>
        private static char GetGenderInput()
        {
            while (true)
            {
                System.Console.Write("Gender (F/M): ");
                var input = System.Console.ReadLine()?.Trim().ToUpper();

                if (input == "F" || input == "M")
                {
                    return input[0];
                }

                System.Console.WriteLine("Invalid input. Please enter 'F' or 'M'.");
            }
        }

        /// <summary>
        /// Gets department selection from the user
        /// </summary>
        /// <returns>Selected Department enum value</returns>
        private static Models.Department GetDepartmentInput()
        {
            System.Console.WriteLine("\nSelect Department:");
            System.Console.WriteLine("1. Sales (Red)");
            System.Console.WriteLine("2. Marketing (Green)");
            System.Console.WriteLine("3. Development (Black)");
            System.Console.WriteLine("4. QA (Blue)");
            System.Console.WriteLine("5. HR (Orange)");
            System.Console.WriteLine("6. SEO (Pink)");

            while (true)
            {
                System.Console.Write("Enter department number (1-6): ");
                var input = System.Console.ReadLine()?.Trim();

                if (int.TryParse(input, out int choice) && choice >= 1 && choice <= 6)
                {
                    return (Models.Department)choice;
                }

                System.Console.WriteLine("Invalid choice. Please enter a number between 1 and 6.");
            }
        }

        /// <summary>
        /// Gets a decimal input from the user with validation
        /// </summary>
        /// <param name="prompt">The prompt to display</param>
        /// <returns>Positive decimal value</returns>
        private static decimal GetDecimalInput(string prompt)
        {
            while (true)
            {
                try
                {
                    System.Console.Write($"{prompt}: ");
                    var input = System.Console.ReadLine()?.Trim();

                    if (decimal.TryParse(input, out var value) && value > 0)
                    {
                        return value;
                    }

                    System.Console.WriteLine("Invalid amount. Please enter a positive number.");
                }
                catch
                {
                    System.Console.WriteLine("Invalid input. Please try again.");
                }
            }
        }

        /// <summary>
        /// Displays error messages in red color
        /// </summary>
        /// <param name="message">The error message to display</param>
        private static void DisplayError(string message)
        {
            var originalColor = System.Console.ForegroundColor;
            System.Console.ForegroundColor = ConsoleColor.Red;
            System.Console.WriteLine($"\n✗ {message}");
            System.Console.ForegroundColor = originalColor;
        }
    }
}
