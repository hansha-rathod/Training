# Part 1: C# Console Application - Detailed Development Plan

## Context

This development plan is for **Part 1 only** of the Employee Management System - a C# Console Application for managing employee data with JSON file storage. This application serves as the backend data management system that creates and maintains the employee JSON file, which will later be consumed by a web application (Part 2).

### Project Location
- **Path**: `C:\Hansha\Projects\Training1\Training\Training\C#\ExamTasks\Task1`
- **Current State**: Empty directory (no existing code)
- **Target**: C# Console Application (.NET Framework 4.7.2+)

### Business Requirements
The application must enable users to:
1. Add new employees with comprehensive validation
2. Delete employees by ID
3. Exit the application
4. Automatically calculate employee experience from joining date
5. Prevent duplicate employees
6. Store data sorted by salary (descending) in JSON format
7. Use dynamic file naming based on current date

---

## Architecture Overview

### Project Structure
```
EmployeeManagement.Console/
├── Models/
│   ├── Employee.cs              # Employee entity model with all properties
│   └── Department.cs            # Department enum with color metadata
├── Services/
│   ├── Interfaces/
│   │   ├── IEmployeeService.cs      # Contract for employee operations
│   │   └── IFileService.cs          # Contract for file I/O operations
│   ├── EmployeeService.cs           # Business logic for employee management
│   └── FileService.cs               # JSON read/write operations
├── Validators/
│   └── EmployeeValidator.cs     # Input validation and business rules
├── Utilities/
│   ├── DateExtensions.cs        # Date formatting extension methods
│   └── ExperienceCalculator.cs  # Experience calculation logic
├── App.config                   # Configuration for file paths
└── Program.cs                   # Main entry point and console UI
```

### Design Principles
- **Separation of Concerns**: UI, business logic, and data access are separated
- **Interface-based Design**: Services use interfaces for testability
- **Single Responsibility**: Each class has one clear purpose
- **DRY Principle**: Common functionality extracted to utilities

---

## Implementation Plan

### Phase 1: Project Setup (Estimated: 30 minutes)

#### Step 1.1: Create C# Console Project
- [ ] Create new Visual Studio project: **File → New → Project → Console App (.NET Framework)**
- [ ] Name: `EmployeeManagement.Console`
- [ ] Location: `C:\Hansha\Projects\Training1\Training\Training\C#\ExamTasks\Task1\EmployeeManagement.Console`
- [ ] Framework: .NET Framework 4.7.2 or higher

#### Step 1.2: Add NuGet Packages
- [ ] Right-click project → Manage NuGet Packages
- [ ] Install `Newtonsoft.Json` (latest stable version, typically 13.0.3)
- [ ] Verify `System.Configuration` is referenced (default in console apps)

#### Step 1.3: Create Folder Structure
- [ ] Add folders: `Models`, `Services\Interfaces`, `Validators`, `Utilities`

#### Step 1.4: Configure App.config
Create `App.config` with:
```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
  <appSettings>
    <add key="JsonFilePath" value="C:\EmployeeData" />
    <add key="JsonFileName" value="EmployeeData" />
  </appSettings>
  <startup>
    <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.7.2" />
  </startup>
</configuration>
```

#### Step 1.5: Verify Setup
- [ ] Build project (Ctrl+Shift+B)
- [ ] Run to confirm "Hello World" output
- [ ] Verify Newtonsoft.Json reference in References

---

### Phase 2: Data Models (Estimated: 45 minutes)

#### Step 2.1: Create Department Enum
**File**: `Models/Department.cs`

```csharp
using System.ComponentModel;

namespace EmployeeManagement.Console.Models
{
    public enum Department
    {
        [Description("Sales")]
        Sales = 1,

        [Description("Marketing")]
        Marketing = 2,

        [Description("Development")]
        Development = 3,

        [Description("QA")]
        QA = 4,

        [Description("HR")]
        HR = 5,

        [Description("SEO")]
        SEO = 6
    }

    public static class DepartmentExtensions
    {
        public static string GetColor(this Department dept)
        {
            return dept switch
            {
                Department.Sales => "Red",
                Department.Marketing => "Green",
                Department.Development => "Black",
                Department.QA => "Blue",
                Department.HR => "Orange",
                Department.SEO => "Pink",
                _ => "Gray"
            };
        }
    }
}
```

**Requirements**:
- [ ] Enum with 6 departments
- [ ] Description attributes for display names
- [ ] Extension method for color mapping
- [ ] Proper namespace

#### Step 2.2: Create Employee Model
**File**: `Models/Employee.cs`

```csharp
using System;
using Newtonsoft.Json;

namespace EmployeeManagement.Console.Models
{
    public class Employee
    {
        [JsonProperty("employeeId")]
        public string EmployeeID { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("dob")]
        public DateTime DOB { get; set; }

        [JsonProperty("gender")]
        public char Gender { get; set; }

        [JsonProperty("designation")]
        public string Designation { get; set; }

        [JsonProperty("city")]
        public string City { get; set; }

        [JsonProperty("state")]
        public string State { get; set; }

        [JsonProperty("postcode")]
        public string Postcode { get; set; }

        [JsonProperty("phone")]
        public string Phone { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("dateOfJoining")]
        public DateTime DateOfJoining { get; set; }

        [JsonProperty("totalExperience")]
        public string TotalExperience { get; set; }

        [JsonProperty("remarks")]
        public string Remarks { get; set; }

        [JsonProperty("department")]
        public Department Department { get; set; }

        [JsonProperty("monthlySalary")]
        public decimal MonthlySalary { get; set; }
    }
}
```

**Requirements**:
- [ ] All 14 properties as specified
- [ ] Newtonsoft.Json attributes for proper serialization
- [ ] Correct data types (DateTime, char, decimal, enum)
- [ ] Nullable properties where appropriate
- [ ] Proper namespace

---

### Phase 3: Utility Classes (Estimated: 1 hour)

#### Step 3.1: Date Extensions
**File**: `Utilities/DateExtensions.cs`

```csharp
using System;

namespace EmployeeManagement.Console.Utilities
{
    public static class DateExtensions
    {
        public static string ToFormattedDate(this DateTime date)
        {
            return date.ToString("dd-MMM-yyyy");
        }

        public static int CalculateAge(this DateTime dob)
        {
            var today = DateTime.Today;
            var age = today.Year - dob.Year;
            if (today < dob.AddYears(age)) age--;
            return age;
        }
    }
}
```

#### Step 3.2: Experience Calculator
**File**: `Utilities/ExperienceCalculator.cs`

```csharp
using System;

namespace EmployeeManagement.Console.Utilities
{
    public static class ExperienceCalculator
    {
        public static string CalculateExperience(DateTime dateOfJoining)
        {
            if (dateOfJoining > DateTime.Today)
                return "0 Years 0 Months";

            var totalMonths = (DateTime.Today.Year - dateOfJoining.Year) * 12 +
                              DateTime.Today.Month - dateOfJoining.Month;

            if (DateTime.Today.Day < dateOfJoining.Day)
                totalMonths--;

            var years = totalMonths / 12;
            var months = totalMonths % 12;

            return $"{years} Years {months} Months";
        }
    }
}
```

**Requirements**:
- [ ] Calculate exact years and months
- [ ] Handle edge cases (future dates, same day)
- [ ] Return format: "X Years Y Months"
- [ ] Unit test with various dates

---

### Phase 4: Validation Layer (Estimated: 1.5 hours)

#### Step 4.1: Create Employee Validator
**File**: `Validators/EmployeeValidator.cs`

```csharp
using System;
using System.Text.RegularExpressions;
using EmployeeManagement.Console.Models;

namespace EmployeeManagement.Console.Validators
{
    public class EmployeeValidator
    {
        public class ValidationResult
        {
            public bool IsValid { get; set; }
            public string ErrorMessage { get; set; }
        }

        public ValidationResult ValidateEmployee(Employee employee, Employee[] existingEmployees)
        {
            // Check for duplicates
            if (IsDuplicateEmployee(employee, existingEmployees))
            {
                return new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = "Employee with this ID or Email already exists."
                };
            }

            // Validate Employee ID
            if (string.IsNullOrWhiteSpace(employee.EmployeeID))
            {
                return new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = "Employee ID cannot be empty."
                };
            }

            // Validate Name
            var nameResult = ValidateName(employee.Name);
            if (!nameResult.IsValid) return nameResult;

            // Validate DOB
            var dobResult = ValidateDOB(employee.DOB);
            if (!dobResult.IsValid) return dobResult;

            // Validate Gender
            var genderResult = ValidateGender(employee.Gender);
            if (!genderResult.IsValid) return genderResult;

            // Validate Email
            var emailResult = ValidateEmail(employee.Email);
            if (!emailResult.IsValid) return emailResult;

            // Validate Phone
            var phoneResult = ValidatePhone(employee.Phone);
            if (!phoneResult.IsValid) return phoneResult;

            // Validate Postcode
            var postcodeResult = ValidatePostcode(employee.Postcode);
            if (!postcodeResult.IsValid) return postcodeResult;

            // Validate Salary
            var salaryResult = ValidateSalary(employee.MonthlySalary);
            if (!salaryResult.IsValid) return salaryResult;

            // Validate Date of Joining
            var joiningResult = ValidateDateOfJoining(employee.DateOfJoining);
            if (!joiningResult.IsValid) return joiningResult;

            return new ValidationResult { IsValid = true };
        }

        private bool IsDuplicateEmployee(Employee employee, Employee[] existingEmployees)
        {
            if (existingEmployees == null) return false;
            return Array.Exists(existingEmployees,
                e => e.EmployeeID == employee.EmployeeID || e.Email == employee.Email);
        }

        private ValidationResult ValidateName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return new ValidationResult { IsValid = false, ErrorMessage = "Name cannot be empty." };
            if (name.Length < 2)
                return new ValidationResult { IsValid = false, ErrorMessage = "Name must be at least 2 characters." };
            return new ValidationResult { IsValid = true };
        }

        private ValidationResult ValidateDOB(DateTime dob)
        {
            if (dob > DateTime.Today)
                return new ValidationResult { IsValid = false, ErrorMessage = "Date of Birth cannot be in the future." };

            var age = dob.CalculateAge();
            if (age < 18)
                return new ValidationResult { IsValid = false, ErrorMessage = "Employee must be at least 18 years old." };

            return new ValidationResult { IsValid = true };
        }

        private ValidationResult ValidateGender(char gender)
        {
            if (gender != 'F' && gender != 'M')
                return new ValidationResult { IsValid = false, ErrorMessage = "Gender must be 'F' or 'M'." };
            return new ValidationResult { IsValid = true };
        }

        private ValidationResult ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return new ValidationResult { IsValid = false, ErrorMessage = "Email cannot be empty." };

            var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            if (!Regex.IsMatch(email, emailPattern))
                return new ValidationResult { IsValid = false, ErrorMessage = "Invalid email format." };

            return new ValidationResult { IsValid = true };
        }

        private ValidationResult ValidatePhone(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return new ValidationResult { IsValid = false, ErrorMessage = "Phone cannot be empty." };

            var phonePattern = @"^\+?[\d\s\-\(\)]+$";
            if (!Regex.IsMatch(phone, phonePattern))
                return new ValidationResult { IsValid = false, ErrorMessage = "Invalid phone number format." };

            return new ValidationResult { IsValid = true };
        }

        private ValidationResult ValidatePostcode(string postcode)
        {
            if (string.IsNullOrWhiteSpace(postcode))
                return new ValidationResult { IsValid = false, ErrorMessage = "Postcode cannot be empty." };

            if (!Regex.IsMatch(postcode, @"^\d+$"))
                return new ValidationResult { IsValid = false, ErrorMessage = "Postcode must contain only numbers." };

            return new ValidationResult { IsValid = true };
        }

        private ValidationResult ValidateSalary(decimal salary)
        {
            if (salary <= 0)
                return new ValidationResult { IsValid = false, ErrorMessage = "Salary must be a positive value." };
            return new ValidationResult { IsValid = true };
        }

        private ValidationResult ValidateDateOfJoining(DateTime dateOfJoining)
        {
            if (dateOfJoining > DateTime.Today)
                return new ValidationResult { IsValid = false, ErrorMessage = "Date of Joining cannot be in the future." };
            return new ValidationResult { IsValid = true };
        }
    }
}
```

**Validation Requirements Checklist**:
- [ ] Employee ID uniqueness
- [ ] Name: minimum 2 characters
- [ ] DOB: not future, age >= 18
- [ ] Gender: only 'F' or 'M'
- [ ] Email: valid format
- [ ] Phone: valid format
- [ ] Postcode: numeric only
- [ ] Salary: positive decimal
- [ ] Date of Joining: not future
- [ ] Duplicate check (ID + Email)

---

### Phase 5: Service Layer (Estimated: 2 hours)

#### Step 5.1: Create Service Interfaces
**File**: `Services/Interfaces/IFileService.cs`

```csharp
using EmployeeManagement.Console.Models;

namespace EmployeeManagement.Console.Services.Interfaces
{
    public interface IFileService
    {
        string GetJsonFilePath();
        Employee[] ReadEmployeesFromFile();
        void WriteEmployeesToFile(Employee[] employees);
        bool FileExists();
    }
}
```

**File**: `Services/Interfaces/IEmployeeService.cs`

```csharp
using EmployeeManagement.Console.Models;
using EmployeeManagement.Console.Validators;

namespace EmployeeManagement.Console.Services.Interfaces
{
    public interface IEmployeeService
    {
        Employee[] GetAllEmployees();
        ValidationResult AddEmployee(Employee employee);
        ValidationResult DeleteEmployee(string employeeId);
        bool EmployeeExists(string employeeId);
    }
}
```

#### Step 5.2: Implement File Service
**File**: `Services/FileService.cs`

```csharp
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using EmployeeManagement.Console.Models;
using EmployeeManagement.Console.Services.Interfaces;

namespace EmployeeManagement.Console.Services
{
    public class FileService : IFileService
    {
        private readonly string _basePath;
        private readonly string _fileName;

        public FileService()
        {
            _basePath = ConfigurationManager.AppSettings["JsonFilePath"];
            _fileName = ConfigurationManager.AppSettings["JsonFileName"];
        }

        public string GetJsonFilePath()
        {
            var currentDate = DateTime.Now.ToString("MMddyyyy");
            var directory = Path.GetDirectoryName(_basePath);

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            return Path.Combine(_basePath, $"{_fileName}_{currentDate}.json");
        }

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

        public bool FileExists()
        {
            return File.Exists(GetJsonFilePath());
        }
    }
}
```

#### Step 5.3: Implement Employee Service
**File**: `Services/EmployeeService.cs`

```csharp
using System;
using System.Linq;
using EmployeeManagement.Console.Models;
using EmployeeManagement.Console.Services.Interfaces;
using EmployeeManagement.Console.Validators;
using EmployeeManagement.Console.Utilities;

namespace EmployeeManagement.Console.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IFileService _fileService;
        private readonly EmployeeValidator _validator;

        public EmployeeService(IFileService fileService)
        {
            _fileService = fileService;
            _validator = new EmployeeValidator();
        }

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

        public ValidationResult AddEmployee(Employee employee)
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

                return new ValidationResult { IsValid = true };
            }
            catch (Exception ex)
            {
                return new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = $"Error adding employee: {ex.Message}"
                };
            }
        }

        public ValidationResult DeleteEmployee(string employeeId)
        {
            try
            {
                var existingEmployees = GetAllEmployees();

                var employeeToDelete = existingEmployees.FirstOrDefault(e => e.EmployeeID == employeeId);

                if (employeeToDelete == null)
                {
                    return new ValidationResult
                    {
                        IsValid = false,
                        ErrorMessage = $"Employee with ID '{employeeId}' not found."
                    };
                }

                var updatedEmployees = existingEmployees
                    .Where(e => e.EmployeeID != employeeId)
                    .ToArray();

                _fileService.WriteEmployeesToFile(updatedEmployees);

                return new ValidationResult { IsValid = true };
            }
            catch (Exception ex)
            {
                return new ValidationResult
                {
                    IsValid = false,
                    ErrorMessage = $"Error deleting employee: {ex.Message}"
                };
            }
        }

        public bool EmployeeExists(string employeeId)
        {
            var employees = GetAllEmployees();
            return employees.Any(e => e.EmployeeID == employeeId);
        }
    }
}
```

**Service Requirements Checklist**:
- [ ] Interfaces for both services
- [ ] File service reads/writes JSON
- [ ] Dynamic file naming with date
- [ ] Auto-create directory if not exists
- [ ] Employee service handles CRUD
- [ ] Automatic sorting by salary (descending)
- [ ] Experience calculation on add
- [ ] Comprehensive exception handling

---

### Phase 6: Console UI (Estimated: 2 hours)

#### Step 6.1: Implement Main Program
**File**: `Program.cs`

```csharp
using System;
using EmployeeManagement.Console.Services;
using EmployeeManagement.Console.Services.Interfaces;

namespace EmployeeManagement.Console
{
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
            }
        }

        private static void DisplayWelcomeMessage()
        {
            System.Console.Clear();
            System.Console.WriteLine("===========================================");
            System.Console.WriteLine("   EMPLOYEE MANAGEMENT SYSTEM");
            System.Console.WriteLine("===========================================");
            System.Console.WriteLine();
        }

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
                }
            }
        }

        private static void DisplayMenu()
        {
            System.Console.WriteLine("\n--- MAIN MENU ---");
            System.Console.WriteLine("1. Add New Employee");
            System.Console.WriteLine("2. Delete Employee");
            System.Console.WriteLine("3. Exit");
            System.Console.WriteLine();
            System.Console.Write("Please enter your choice (1-3): ");
        }

        private static string GetUserChoice()
        {
            return System.Console.ReadLine()?.Trim() ?? "";
        }

        private static void AddNewEmployee()
        {
            try
            {
                System.Console.WriteLine("\n--- ADD NEW EMPLOYEE ---");

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

        private static void DeleteEmployee()
        {
            try
            {
                System.Console.WriteLine("\n--- DELETE EMPLOYEE ---");

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

        private static void DisplayError(string message)
        {
            var originalColor = System.Console.ForegroundColor;
            System.Console.ForegroundColor = ConsoleColor.Red;
            System.Console.WriteLine($"\n✗ {message}");
            System.Console.ForegroundColor = originalColor;
        }
    }
}
```

**UI Requirements Checklist**:
- [ ] Clear menu system with 3 options
- [ ] Proper prompts for all input fields
- [ ] Inline validation feedback
- [ ] Success/error messages
- [ ] Department selection menu with colors
- [ ] Proper exception handling in UI
- [ ] Loop after each operation
- [ ] Professional formatting

---

### Phase 7: Testing & Verification (Estimated: 1 hour)

#### Step 7.1: Unit Testing Checklist
Create test scenarios for each validation rule:

**Name Validation**:
- [ ] Empty name → error
- [ ] Single character → error
- [ ] Valid name (2+ chars) → success

**DOB Validation**:
- [ ] Future date → error
- [ ] Age < 18 → error
- [ ] Age >= 18 → success

**Gender Validation**:
- [ ] 'F' → success
- [ ] 'M' → success
- [ ] Any other character → error

**Email Validation**:
- [ ] Empty → error
- [ ] Invalid format (no @) → error
- [ ] Invalid format (no domain) → error
- [ ] Valid format → success

**Salary Validation**:
- [ ] Zero or negative → error
- [ ] Positive value → success

**Duplicate Prevention**:
- [ ] Add same employee ID twice → error
- [ ] Add same email twice → error
- [ ] Unique employee → success

#### Step 7.2: Integration Testing
- [ ] Add 5+ employees with different departments
- [ ] Verify JSON file created with correct name format
- [ ] Verify employees sorted by salary (descending)
- [ ] Verify experience calculated correctly
- [ ] Delete an existing employee → success
- [ ] Delete non-existent employee → error
- [ ] Verify JSON file updated after operations

#### Step 7.3: JSON Structure Verification
Expected JSON structure:
```json
[
  {
    "employeeId": "EMP001",
    "name": "John Doe",
    "dob": "1990-05-15T00:00:00",
    "gender": "M",
    "designation": "Software Engineer",
    "city": "New York",
    "state": "NY",
    "postcode": "10001",
    "phone": "+1234567890",
    "email": "john@example.com",
    "dateOfJoining": "2020-01-15T00:00:00",
    "totalExperience": "4 Years 2 Months",
    "remarks": "Good performer",
    "department": 3,
    "monthlySalary": 7500.00
  }
]
```

**Verification Points**:
- [ ] File named correctly: `EmployeeData_MMddyyyy.json`
- [ ] Array format (not object)
- [ ] All fields present
- [ ] Sorted by monthlySalary (descending)
- [ ] Proper date serialization
- [ ] Department stored as integer (enum value)

#### Step 7.4: Exception Handling Test
- [ ] Invalid file path → proper error message
- [ ] Corrupted JSON file → proper error message
- [ ] Invalid date format → retry prompt
- [ ] All exceptions caught and displayed

---

## Dependencies & NuGet Packages

### Required Packages
```
Newtonsoft.Json (13.0.3 or later)
  - For JSON serialization/deserialization
```

### Built-in References
```
System.Configuration.ConfigurationManager
  - For reading App.config settings
System
  - Core functionality
System.Core
  - LINQ extensions
```

---

## Critical Files Summary

| File | Purpose | Key Features |
|------|---------|--------------|
| `Models/Employee.cs` | Data model | 14 properties, JSON attributes |
| `Models/Department.cs` | Department enum | 6 values with color mapping |
| `Services/Interfaces/IFileService.cs` | File I/O contract | Read/write/exists methods |
| `Services/Interfaces/IEmployeeService.cs` | Employee operations contract | CRUD methods |
| `Services/FileService.cs` | JSON file operations | Dynamic naming, error handling |
| `Services/EmployeeService.cs` | Business logic | Validation, sorting, experience calc |
| `Validators/EmployeeValidator.cs` | Input validation | All validation rules |
| `Utilities/DateExtensions.cs` | Date formatting | ToFormattedDate, CalculateAge |
| `Utilities/ExperienceCalculator.cs` | Experience logic | Years and months calculation |
| `App.config` | Configuration | File path settings |
| `Program.cs` | Main entry | Console UI and menu system |

---

## Verification Steps

### 1. Build Verification
```bash
# Build project
Ctrl+Shift+B in Visual Studio
# OR
dotnet build
```

**Expected**: No build errors, 0 warnings

### 2. Runtime Verification
1. Run application (F5 or Ctrl+F5)
2. Verify welcome message displays
3. Test Option 1 (Add Employee):
   - Add employee with all departments
   - Test validation with invalid data
   - Verify success message
4. Test Option 2 (Delete Employee):
   - Delete existing employee
   - Try deleting non-existent employee
5. Test Option 3 (Exit):
   - Verify clean exit
6. Check JSON file creation:
   - Navigate to configured path
   - Verify file exists with correct name
   - Open and verify JSON structure

### 3. Business Logic Verification
- [ ] Experience calculated correctly (test with various joining dates)
- [ ] Employees sorted by salary descending
- [ ] Duplicate employees prevented
- [ ] File name includes current date
- [ ] All validations trigger correctly

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Newtonsoft.Json not found | Install NuGet package |
| App.config not reading values | Add System.Configuration reference |
| JSON file not creating | Check directory permissions in App.config path |
| Date parsing errors | Use consistent date format prompts |
| Salary sorting not working | Verify OrderByDescending is called before Write |
| Experience calculation off by 1 | Check day comparison in calculator |

---

## Success Criteria for Part 1

- [x] C# console project created and builds successfully
- [x] All 6 department enums with color mapping implemented
- [x] Employee model with all 14 properties
- [x] JSON file created with dynamic naming (EmployeeData_MMddyyyy.json)
- [x] Menu system with 3 options working
- [x] Add Employee with all validations passing
- [x] Delete Employee by ID working
- [x] Duplicate prevention (ID and Email check)
- [x] Experience automatically calculated from joining date
- [x] Employees sorted by salary (descending) before saving
- [x] File path stored in App.config
- [x] Exception handling with proper error messages
- [x] OOPS principles applied (interfaces, classes, separation of concerns)
- [x] Coding standards followed (naming conventions, comments)

---

## Next Steps (Part 2 Preparation)

After completing Part 1, the JSON file will be ready for consumption by the web application:
- File location: `C:\EmployeeData\EmployeeData_MMddyyyy.json`
- Structure: Array of employee objects
- Sorted by: Monthly salary (descending)
- Ready for: Ajax consumption in Part 2

---

**Document Version**: 1.0
**Created**: March 13, 2026
**For**: C# Exam Task - Part 1 Only
**Status**: Ready for Implementation
