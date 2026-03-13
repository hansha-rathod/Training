# Employee Management Console Application - Part 1

## Overview

This is a C# Console Application for managing employee data with JSON file storage. It is Part 1 of the Employee Management System project.

## Features

- ✅ Add new employees with comprehensive validation
- ✅ Delete employees by ID
- ✅ Automatic experience calculation from joining date
- ✅ Duplicate employee prevention (by ID and Email)
- ✅ Employees automatically sorted by salary (descending)
- ✅ Dynamic JSON file naming with current date
- ✅ Configuration via App.config

## Project Structure

```
EmployeeManagement.Console/
├── Models/
│   ├── Employee.cs              # Employee entity model
│   └── Department.cs            # Department enum with colors
├── Services/
│   ├── Interfaces/
│   │   ├── IEmployeeService.cs      # Employee operations contract
│   │   └── IFileService.cs          # File I/O contract
│   ├── EmployeeService.cs           # Business logic
│   └── FileService.cs               # JSON operations
├── Validators/
│   └── EmployeeValidator.cs     # Input validation
├── Utilities/
│   ├── DateExtensions.cs        # Date formatting
│   └── ExperienceCalculator.cs  # Experience calculation
├── App.config                   # Configuration
├── Program.cs                   # Main entry point
└── EmployeeManagement.Console.csproj  # Project file
```

## Prerequisites

- **.NET Framework 4.7.2** or higher
- **Visual Studio 2019** or later (recommended)
- **Newtonsoft.Json** NuGet package (13.0.3)

## Installation

### Option 1: Using Visual Studio

1. Open Visual Studio
2. Select **File → Open → Project/Solution**
3. Navigate to `EmployeeManagement.Console.csproj`
4. Open the project
5. Right-click on the project in Solution Explorer
6. Select **Manage NuGet Packages**
7. Search for and install **Newtonsoft.Json** (version 13.0.3 or later)

### Option 2: Using NuGet Command Line

```bash
cd EmployeeManagement.Console
nuget install Newtonsoft.Json -Version 13.0.3
```

## Configuration

The application uses `App.config` for file path configuration:

```xml
<appSettings>
  <add key="JsonFilePath" value="C:\EmployeeData" />
  <add key="JsonFileName" value="EmployeeData" />
</appSettings>
```

**Note:** The application will automatically create the `C:\EmployeeData` directory if it doesn't exist.

## Building the Project

### Using Visual Studio:
1. Open the project in Visual Studio
2. Press **Ctrl+Shift+B** or go to **Build → Build Solution**
3. Ensure there are no build errors

### Using Command Line:
```bash
msbuild EmployeeManagement.Console.csproj /p:Configuration=Release
```

## Running the Application

### From Visual Studio:
- Press **F5** to run with debugging
- Press **Ctrl+F5** to run without debugging

### From Command Line:
```bash
cd bin\Debug
EmployeeManagement.Console.exe
```

## Usage

### Main Menu

When you run the application, you'll see:

```
===========================================
   EMPLOYEE MANAGEMENT SYSTEM
===========================================

--- MAIN MENU ---
1. Add New Employee
2. Delete Employee
3. Exit

Please enter your choice (1-3):
```

### Adding an Employee

Select option 1 and fill in all required fields:

1. **Employee ID** - Unique identifier (e.g., EMP001)
2. **Name** - Full name (minimum 2 characters)
3. **Date of Birth** - In format DD-MM-YYYY (must be 18+ years old)
4. **Gender** - F or M
5. **Designation** - Job title
6. **City** - City name
7. **State** - State name
8. **Postcode** - Postal code (numbers only)
9. **Phone** - Contact number
10. **Email** - Valid email address
11. **Date of Joining** - In format DD-MM-YYYY
12. **Remarks** - Optional notes
13. **Department** - Select from 1-6:
   - 1. Sales (Red)
   - 2. Marketing (Green)
   - 3. Development (Black)
   - 4. QA (Blue)
   - 5. HR (Orange)
   - 6. SEO (Pink)
14. **Monthly Salary** - Positive decimal number

### Deleting an Employee

Select option 2 and enter the Employee ID you want to delete.

### Exiting

Select option 3 to exit the application.

## Validation Rules

The application enforces these validation rules:

| Field | Rule |
|-------|------|
| Employee ID | Must be unique |
| Name | Minimum 2 characters |
| Date of Birth | Not in future, Age ≥ 18 |
| Gender | Only 'F' or 'M' |
| Email | Valid email format |
| Phone | Valid phone number format |
| Postcode | Numbers only |
| Monthly Salary | Positive value |
| Date of Joining | Not in future |
| Duplicate Check | ID and Email must be unique |

## JSON File Structure

The application stores data in `C:\EmployeeData\EmployeeData_MMddyyyy.json`:

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

**Important:** Employees are automatically sorted by `monthlySalary` in descending order before saving.

## Key Features

### Automatic Experience Calculation

The application automatically calculates work experience based on the Date of Joining:
- Format: "X Years Y Months"
- Accounts for exact month/day differences

### Department Color Mapping

Each department has an associated color for UI display:
- **Sales** → Red
- **Marketing** → Green
- **Development** → Black
- **QA** → Blue
- **HR** → Orange
- **SEO** → Pink

### Duplicate Prevention

The application prevents duplicate employees by checking:
- Employee ID must be unique
- Email address must be unique

## OOPS Principles Applied

- **Encapsulation**: Private fields with public properties
- **Abstraction**: Interfaces for services (`IEmployeeService`, `IFileService`)
- **Inheritance**: Extension methods extend functionality
- **Polymorphism**: Interface-based design allows different implementations
- **Single Responsibility**: Each class has one clear purpose
- **Dependency Injection**: Services depend on interfaces, not concrete types

## Error Handling

The application includes comprehensive exception handling:
- Try-catch blocks around all file operations
- User-friendly error messages
- Validation feedback for all inputs
- Color-coded error messages (red for errors)

## Troubleshooting

### Common Issues

**Issue:** `Newtonsoft.Json not found`
- **Solution:** Install the Newtonsoft.Json NuGet package

**Issue:** `JSON file not creating`
- **Solution:** Check directory permissions in App.config path

**Issue:** `Date parsing errors`
- **Solution:** Use consistent date format (DD-MM-YYYY)

**Issue:** `Salary sorting not working`
- **Solution:** Verify OrderByDescending is called before Write

## Next Steps

After completing Part 1, the JSON file can be consumed by:
- **Part 2:** Web Application with HTML/Bootstrap/jQuery/Ajax
- Features: Employee listing, sorting, searching, pagination

## Success Criteria

- ✅ C# console project builds successfully
- ✅ All 6 department enums with color mapping implemented
- ✅ Employee model with all 14 properties
- ✅ JSON file created with dynamic naming
- ✅ Menu system with 3 options working
- ✅ Add Employee with all validations passing
- ✅ Delete Employee by ID working
- ✅ Duplicate prevention (ID and Email check)
- ✅ Experience automatically calculated from joining date
- ✅ Employees sorted by salary (descending) before saving
- ✅ File path stored in App.config
- ✅ Exception handling with proper error messages
- ✅ OOPS principles applied
- ✅ Coding standards followed

## License

This project is part of a training exercise.

## Version

**Version:** 1.0
**Created:** March 13, 2026
**Framework:** .NET Framework 4.7.2
**Language:** C#
